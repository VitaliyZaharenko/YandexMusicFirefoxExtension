import { 
    PlayerCapability 
} from "../player";
import { 
    BaseViewInterface 
} from "../common"
import { 
    ActivePlayerManagerInterface 
} from "../players";
import { 
    DoubleEventRecognizer, SingleEventRecognizer 
} from "../recognizers";
import { 
    ObjectEquality 
} from "../utilites";

export { Command, CommandDispatcherInterface, BackgroundScriptCommandDispatcher }

interface Command extends ObjectEquality<Command> {
    name: string
}

interface CommandDispatcherInterface {
    dispatch(command: Command)
}

class BackgroundScriptCommandDispatcher implements CommandDispatcherInterface {

    private singleRecognizer: SingleEventRecognizer<Command>
    private doubleRecognizer: DoubleEventRecognizer<Command>

    constructor(
        private view: BaseViewInterface,
        private playerManager: ActivePlayerManagerInterface,
        public onRunNativeAppCommand)
    {
        this.registerCommands()
        this.setupRecognizers()
    }

    private registerCommands(){
        browser.commands.onCommand.addListener((command) => {
            let commandObject: Command = {
                name: command,
                equalsTo: function(other) { return name == other.name }
            }
            this.dispatch(commandObject)
        })
    }

    private setupRecognizers() {
        this.doubleRecognizer = new DoubleEventRecognizer(400)
        this.doubleRecognizer.onDoubleEvent = this.handleDoubleCommand.bind(this)
        this.singleRecognizer = new SingleEventRecognizer(this.doubleRecognizer)
        this.singleRecognizer.onSingleEvent = this.handleSingleCommand.bind(this)
    }

    dispatch(command: Command) {
        this.singleRecognizer.consumeEntity(command)
    }

    handleDoubleCommand(recognizer, command) {
        switch(command.name) {
            case 'step-forward-command':
                this.playerManager.active.provide(PlayerCapability.NextTrack)
                break;
            case 'step-back-command':
                this.playerManager.active.provide(PlayerCapability.PreviousTrack)
                break;
            default:
                break;
        }
    }

    handleSingleCommand(recognizer, command) {
        switch (command.name){
            case 'step-back-command':
                this.playerManager.active.provide(PlayerCapability.StepBack)
                break;
            case 'step-forward-command':
                this.playerManager.active.provide(PlayerCapability.StepForward)
                break;
            case 'play-pause-command':
                this.playerManager.active.provide(PlayerCapability.TogglePlaying)
                break;
            case 'run-native-app-command':
                this.onRunNativeAppCommand()
                break;
            default:
                this.view.showError("Unknown command: " + command.name)
                break;
        }
    }
}