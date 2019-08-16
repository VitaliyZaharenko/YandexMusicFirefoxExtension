import { BaseViewInterface } from './base_view_interface'

export { ConsoleView, BaseViewInterface }

class ConsoleView implements BaseViewInterface {

    showError(message: string) {
        console.log("error: \n" + message)
    }

    showMessage(message: string) {
        console.log(message)
    }
}
