import { Projectionist } from "../../projections/Projectionist";
import { MessageSender, Message } from "@darkbyte/messaging";
import { ReplayProjectionCommand } from "../messages/ReplayProjectionCommand";
import { ProjectorRegistrationService } from "../../../domain/app-services/ProjectorRegistrationService";
import { Projector } from "../../projections/Projector";

export class ProjectionistProxy implements Projectionist {

    constructor(
        private messageSender: MessageSender,
        private projectors: ProjectorRegistrationService
    ) { }

    private doLog(message: string) {
        //console.log(`[Proxy] ${message}`);
    }

    private clearProjector(projector: Projector): Promise<void> {
        this.doLog(`Starting transaction to clear projector ${projector.getId()}`);

        return projector.clear()
            .then(() => {
                this.doLog(`Clear of projector ${projector.getId()} succesfully completed`);
            }).catch((error) => {
                this.doLog(`Error clearing projector ${projector.getId()}: ${error.message}`);
                return Promise.reject(error);
            });
    }

    async replay(projectorId: string): Promise<void> {
        try {
            const projector = this.projectors.getById(projectorId);
            this.doLog(`Wanna replay projector ${projectorId}`);

            return this.clearProjector(projector)
                .then(() => {
                    this.doLog(`Sending replay message for projector ${projectorId}`);
                    const replayMessage: Message = ReplayProjectionCommand(projector);
                    const subscriptionId = projector.getId();
                    
                    return this.messageSender.send(replayMessage, subscriptionId)
                        .then(() => {
                            this.doLog(`Replay message sent for projector ${projectorId}`);
                        });
                });
        } catch (error) {
            return Promise.reject(error);
        }
    }

}