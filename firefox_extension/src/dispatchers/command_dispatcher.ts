import { PlayerClientInterface } from "../player/player_interface";
import { PlayerCapability } from "../player/capabilities";
import { BaseViewInterface } from "../common/console_view"
import { ActivePlayerManagerInterface } from "../players/active_player_manager";
import { PatternRecognizerInterface, TimedEvent, DoubleEventRecognizer, SingleEventRecognizer } from "../recognizers/pattern_recognizer";


export { Command, CommandDispatcherInterface, BackgroundScriptCommandDispatcher }


interface Command {
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
            this.dispatch({name: command} as Command)
        })
    }

    private setupRecognizers() {
        //this.doubleRecognizer = new DoubleEventRecognizer()
        //this.doubleRecognizer.onDoubleEvent = this.handleDoubleCommand.bind(this)
        this.singleRecognizer = new SingleEventRecognizer(null)
        this.singleRecognizer.onSingleEvent = this.handleSingleCommand.bind(this)
    }


    dispatch(command: Command) {
        this.singleRecognizer.consumeEntity(command)
    }

    handleDoubleCommand(recognizer, command) {
        console.log("DOUBLE COMMAND---------")
        console.log(command)
    }

    handleSingleCommand(recognizer, command) {
        switch (command.name){
            case 'prev-track-command':
                this.playerManager.active.provide(PlayerCapability.PreviousTrack)
                break;
            case 'next-track-command':
                this.playerManager.active.provide(PlayerCapability.NextTrack)
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