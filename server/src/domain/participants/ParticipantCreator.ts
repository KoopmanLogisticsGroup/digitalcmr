import {Factory} from 'composer-common';
import {BuilderUtils} from '../../blockchain/BuilderUtils';

export class ParticipantCreator {
  public static buildParticipant(factory: Factory, namespace: string, participant: any, participantID?: string): any {
    let participantResource     = BuilderUtils.createResource(factory, namespace, participant.$class, participant, participantID);
    participantResource.address = BuilderUtils.createConcept(factory, namespace, 'Address', participant.address);

    return participantResource;
  }
}