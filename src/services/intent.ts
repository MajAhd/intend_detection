import nlp from 'compromise';

enum FlowType {
  Normal = 'Normal',
  CheckIn = 'CheckIn',
  SuicideRisk = 'SuicideRisk',
}

enum IntentType {
  FAQ,
  SuicideRisk,
  Normal,
}

export const scripts = {
  faq: {
    default:
      'Visit our FAQ page https://www.clareandme.com/faq and follow the relevant instructions.',
    cancelSubscription:
      "Visit our FAQ page https://www.clareandme.com/faq and follow the 'Subscription' instructions.",
    officeHours:
      "Our hours are 9 AM to 5 PM, Monday through Friday. Check the 'Contact Us' section on our FAQ page.",
  },
  suicideRisk:
    "I'm really sorry you're feeling this way. Please talk to a mental health professional or contact a crisis hotline right away. Your safety is very important.",
  normal: {
    anxious: "I'm sorry to hear that. Can you tell me more about it?",
    stress: 'Stress can be tough. Have you tried any relaxation techniques?',
    default: "I'm here for you. Tell me more.",
    good: 'Great! Anything specific that made today good?',
    bad: "I'm sorry to hear that. What's been going on?",
    overwhelmed:
      'That sounds tough. Would you like some tips or to talk more about it?',
  },
  checkIn: 'How are you doing today?',
};

const intentKeywords = {
  faq: [
    'cancel my subscription',
    'my subscription',
    'cancel subscription',
    'office hours',
    'refund',
    'billing issue',
  ],
  suicideRisk: [
    'suicide',
    'hurt myself',
    'end my life',
    'kill myself',
    'die',
    'hang my self',
  ],
};

export class IntentHandler {
  /**
   * Handle user response base on intent and currentFlow
   */
  public currentFlow: FlowType = FlowType.Normal;

  handleMessage(message: string): string {
    const intent = new IntentDetection(message).detectIntent();
    switch (intent) {
      case IntentType.FAQ:
        return new handleFAQ(message).response();
      case IntentType.SuicideRisk:
        this.currentFlow = FlowType.SuicideRisk;
        return new handleSuicideRisk(message).response();
      case IntentType.Normal:
        return new handleNormal(message).response();

      default:
        return scripts.normal.default;
    }
  }

  CheckInFlow(): string {
    this.currentFlow = FlowType.CheckIn;
    return new handleCheckInFlow().response();
  }
}

class IntentDetection {
  /***
   * Detect intend of user message  and return intend name
   */
  protected message: string;
  constructor(message: string) {
    this.message = message;
  }
  detectIntent(): IntentType {
    const normalizedMessage = nlp(this.message)
      .normalize({ lowercase: true, punctuation: true })
      .out('text');

    if (
      intentKeywords.suicideRisk.some((keyword) =>
        normalizedMessage.includes(keyword)
      )
    ) {
      return IntentType.SuicideRisk;
    }

    if (
      intentKeywords.faq.some((keyword) => normalizedMessage.includes(keyword))
    ) {
      return IntentType.FAQ;
    }

    return IntentType.Normal;
  }
}

/**
 * to better and cleaner code and avoid possibles changes of IntentHandler class and ease of test cases
 * I created handler for specific flow :
 * handleCheckInFlow
 * handleFAQ
 * handleSuicideRisk
 * handleNormal
 */
class handleCheckInFlow {
  response(): string {
    return scripts.checkIn;
  }
}

class handleFAQ {
  protected message: string;
  constructor(message: string) {
    this.message = message;
  }

  response(): string {
    if (this.message.includes('cancel my subscription')) {
      return scripts.faq.cancelSubscription;
    } else if (this.message.includes('office hours')) {
      return scripts.faq.officeHours;
    }
    return scripts.faq.default;
  }
}

class handleSuicideRisk {
  protected message: string;
  constructor(message: string) {
    this.message = message;
  }
  response(): string {
    return scripts.suicideRisk;
  }
}

class handleNormal {
  protected message: string;
  constructor(message: string) {
    this.message = message;
  }
  response(): string {
    const doc = nlp(this.message);
    const isAnxious = doc.match('anxious').found;
    const isStressed = doc.match('stressed').found;
    const isGood = doc.match('good').found;
    const isBad = doc.match('bad').found;
    const isOverwhelmed = doc.match('overwhelmed').found;

    if (isAnxious) {
      return scripts.normal.anxious;
    } else if (isStressed) {
      return scripts.normal.stress;
    } else if (isGood) {
      return scripts.normal.good;
    } else if (isBad) {
      return scripts.normal.bad;
    } else if (isOverwhelmed) {
      return scripts.normal.overwhelmed;
    } else {
      return scripts.normal.default;
    }
  }
}
