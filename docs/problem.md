# Coding challenge 

### **Intent Detection and Flow Management Challenge**

### **Objective:**

Create a service that classifies user messages, manages conversation flows and maintains context. The service should handle general interactions, FAQ requests, and responses to suicide risk.

You can use fixed responses or integrate with an AI model like GPT.

### **Flows Types:**

1. **Normal Flow** - General mental health support and conversations.
2. **Check-In Flow** - Mood check-in initiated by the system.

### **Requirements:**

1. **Intent Detection:**
    - **Classify incoming messages** as either FAQ, Suicide Risk, or normal messages.
    - **For FAQ**, provide responses based on [Clare's FAQ page](https://www.clareandme.com/faq).
    - **For Suicide Risk**, respond with a sensitive message and then continue with the previous flow (Normal or Check-In).
2. **Flow Management:**
    - **Normal Flow:** Initiated by the user and manages general interactions and support.
    - **Check-In Flow:** Initiated by the system (e.g., "How are you doing today?"). Classify the user’s response:
    
    **If FAQ or Suicide Risk:** Handle accordingly.
    
    **Otherwise:** Continue with Check-In Flow or Normal Flow based on the current flow.
    

1. **API Endpoints:**
    - **POST /sendMessage:** Classify messages and handle flows.
    - **POST /initiateCheckIn:** Start a Check-In Flow and set context.
    - **GET /retrieveContext:** Get the current context for a user.
    - **POST /updateContext:** Update context in Redis.
    - Secure endpoints with any authentication method you choose.
2. **Data Storage:** Use Redis to manage the state of the conversation and its context.
3. **Testing:** Provide unit and integration tests for your code

### **Technical Requirements:**

- **Tech Stack:** Node.js with TypeScript, Redis.
- **Security:** Any authentication method.
- **Testing:** Use Jest.
- **Deployment:** Dockerize the app.

### **Bonus (Optional):**

- Advanced NLP integration.

### **Submission Requirements:**

- Submit code via Git repository.
- Include a README with setup instructions.
- Provide a Design document.
- Include any assumptions you’ve made or specific details about your implementation approach.

### **Assumptions you can make:**

- **Classification Logic:** Use simple rules or an external service for classification, such as keyword matching or an NLP model.
- **Responses**: You can use fixed responses or integrate with an AI model like GPT.
- **Conversation Initiation:** For Check-In Flow, use a predefined script like "How are you doing today?" without needing classification.
- **Suicide Risk Handling:** Use a predefined, sensitive response for mentions of suicide or self-harm, then continue with the previous flow (Normal or Check-In).

**Sample Responses:**

### **Normal Flow**

1. **User:** "I’m feeling anxious today."
2. **Clare:** "I'm sorry to hear that. Can you tell me more about it?"
3. **User:** "I've been stressed at work."
4. **Clare:** "Stress can be tough. Have you tried any relaxation techniques?"

### **Check-In Flow**

1. **Clare Initiates:** "Hi! How are you doing today?"
2. **User:** "Good."
3. **Clare:** "Great! Anything specific that made today good?"
4. **User:** "Just a good day at work."
5. **Clare:** "Awesome! If you need anything, I'm here."

**Alternate Flow for Different Responses:**

1. **Clare Initiates:** "Hi! How are you doing today?"
2. **User:** "Bad."
3. **Clare:** "I'm sorry to hear that. What's been going on?"
4. **User:** "I'm feeling overwhelmed."
5. **Clare:** "That sounds tough. Would you like some tips or to talk more about it?"

### **FAQ**

1. **User:** "How do I cancel my subscription?"
2. **Clare:** "Visit our FAQ page [here](https://www.clareandme.com/faq) and follow the 'Subscription' instructions."
3. **User:** "What are your office hours?"
4. **Clare:** "Our hours are 9 AM to 5 PM, Monday through Friday. Check the 'Contact Us' section on our FAQ page for details."

### **Suicide Risk**

1. **User:** "I’m feeling like I might hurt myself."
2. **Clare:** "I'm really sorry you're feeling this way. Please talk to a mental health professional or contact a crisis hotline right away. Your safety is very important."