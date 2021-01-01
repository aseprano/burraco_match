import { MatchInitialized } from "../../../src/domain/events/MatchInitialized";

describe('MatchInitialized', () => {

    it('builds the proper payload', () => {
        expect(MatchInitialized.EventName).toBe('com.herrdoktor.buraco.events.MatchInitialized');

        const event = new MatchInitialized(10);
        
        expect(event.getName()).toEqual(MatchInitialized.EventName);

        expect(event.getPayload()).toEqual({
            id: 10
        });
    });
    
})