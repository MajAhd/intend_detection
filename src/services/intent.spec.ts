import { IntentHandler, scripts } from './intent';

describe('Intent detection & handler', () => {
  let intentHandler: IntentHandler;

  beforeEach(() => {
    intentHandler = new IntentHandler();
  });
  // Test: Handle Normal Flow (Everything works)
  it('should handle a normal flow message - anxious', () => {
    const response = intentHandler.handleMessage('I’m feeling anxious today.');
    expect(response).toBe(scripts.normal.anxious);
  });

  it('should handle a normal flow message - stressed', () => {
    const response = intentHandler.handleMessage(
      'I have been stressed at work.'
    );
    expect(response).toBe(scripts.normal.stress);
  });

  it('should handle a normal flow message with a default response', () => {
    const response = intentHandler.handleMessage(
      'I am just feeling a bit confused.'
    );
    expect(response).toBe(scripts.normal.default);
  });

  // Test: Check-In Flow
  it('should handle check-in flow initiation', () => {
    const response = intentHandler.CheckInFlow();
    expect(response).toBe(scripts.checkIn);
  });

  it('should handle a check-in flow response - good', () => {
    intentHandler.CheckInFlow();
    const response = intentHandler.handleMessage('I’m feeling good today.');
    expect(response).toBe(scripts.normal.good);
  });

  it('should handle a check-in flow response - bad', () => {
    intentHandler.CheckInFlow();
    const response = intentHandler.handleMessage('I’m feeling bad today.');
    expect(response).toBe(scripts.normal.bad);
  });

  // Test: Handle FAQ intent (Everything works)
  it('should handle an FAQ request - cancel subscription', () => {
    const response = intentHandler.handleMessage(
      'How do I cancel my subscription?'
    );
    expect(response).toBe(scripts.faq.cancelSubscription);
  });

  it('should handle an FAQ request - office hours', () => {
    const response = intentHandler.handleMessage('What are your office hours?');
    expect(response).toBe(scripts.faq.officeHours);
  });

  // Test: Handle Suicide Risk (Everything works)
  it('should handle a suicide risk message', () => {
    const response = intentHandler.handleMessage(
      'I feel like I might hurt myself.'
    );
    expect(response).toBe(scripts.suicideRisk);
    expect(intentHandler.currentFlow).toBe('SuicideRisk'); // Ensure the flow switches to suicide risk
  });

  // Test: Edge Case - No intent detected (Nothing works)
  it('should return default response when no intent is detected', () => {
    const response = intentHandler.handleMessage('Just a random message.');
    expect(response).toBe(scripts.normal.default);
  });

  // Test: Handle empty message (Nothing works)
  it('should handle an empty message', () => {
    const response = intentHandler.handleMessage('');
    expect(response).toBe(scripts.normal.default);
  });

  // Test: Handle undefined or null message (Nothing works)
  it('should handle an undefined message', () => {
    const response = intentHandler.handleMessage(undefined as any); // Simulating undefined input
    expect(response).toBe(scripts.normal.default);
  });

  it('should handle a null message', () => {
    const response = intentHandler.handleMessage(null as any); // Simulating null input
    expect(response).toBe(scripts.normal.default);
  });

  // Test: Check-In Flow - After handling suicide risk
  it('should return suicide risk message but continue check-in flow', () => {
    intentHandler.CheckInFlow(); // Initiate check-in flow
    const suicideResponse = intentHandler.handleMessage(
      'I feel like I want to die.'
    );
    expect(suicideResponse).toBe(scripts.suicideRisk);
    expect(intentHandler.currentFlow).toBe('SuicideRisk');

    // Ensure Check-In Flow continues after handling suicide risk
    const nextResponse = intentHandler.handleMessage('I am feeling good.');
    expect(nextResponse).toBe(scripts.normal.good);
  });
});
