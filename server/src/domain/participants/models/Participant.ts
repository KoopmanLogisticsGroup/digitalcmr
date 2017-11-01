export abstract class Participant {
  public $class: string;
  public participantID: string;

  public constructor($class: string, participantID: string) {
    this.$class        = $class;
    this.participantID = participantID;
  }
}