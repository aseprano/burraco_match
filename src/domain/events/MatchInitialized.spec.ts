import { MatchInitialized } from "./MatchInitialized";

describe('MatchInitialized', () => {

    it('builds the proper payload', () => {
        const event = new MatchInitialized(10);
        
        expect(event.getName()).toEqual('com.herrdoktor.buraco.events.MatchInitialized');

        expect(event.getPayload()).toEqual({
            id: 10
        });
    });
    
})