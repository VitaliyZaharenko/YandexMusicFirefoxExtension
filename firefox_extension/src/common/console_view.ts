import { BaseViewInterface } from './base_view_interface'

export { ConsoleView, BaseViewInterface }

class ConsoleView implements BaseViewInterface {

    showError(error: any) {
        console.log("error: \n")
        console.log(error)
    }

    showMessage(message: any) {
        console.log(message)
    }
}
