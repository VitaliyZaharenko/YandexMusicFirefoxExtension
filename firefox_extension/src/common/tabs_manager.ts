import { PlayerSourcesProviderInterface } from "../providers/player_sources_provider_interface";
import { PlayerSourceProvider } from '../providers/player_sources_provider'
import { PlayerSourceInterface } from "../player/player_source_interface";

export { TabsManager }

class TabsManager {


    playerSources = new Array<PlayerSourceInterface>()
    sourcesTabs = new Array<Array<number>>()

    activeTab: number | null

    onTabClosed?: (tabId: number, source: PlayerSourceInterface) => void

    constructor(
        private provider: PlayerSourcesProviderInterface = PlayerSourceProvider.shared
        ) 
    {
        this.registerOnRemove()
    }

    async scanTabs(): Promise<boolean> {
        
        let promises = []
        let sources = []

        this.sourcesTabs = []
        this.playerSources = []

        this.provider.supportedSources().forEach(source => {
            let promise = browser.tabs.query({url: source.urlPattern})
            promises.push(promise)
            sources.push(source)
        });

        try { 
            let result = await Promise.all(promises)
            result.forEach((tabs: any[], index) => {
                this.playerSources.push(sources[index])
                this.sourcesTabs.push(tabs.map((tab) => { return tab.id }))
            })
        } catch (error) {
            console.log("tab manager error: " + error)
            return false
        }
    }

    private registerOnRemove() { 
        browser.tabs.onRemoved.addListener((tabId) => {
            if (this.activeTab == tabId) {
                this.activeTab = null
            }
            this.sourcesTabs.forEach((tabs, index) => {
                let findIndex = tabs.findIndex((tab) => { return tab == tabId})
                if (findIndex >= 0) {
                    tabs.splice(findIndex, 1)
                    if (this.onTabClosed) {
                        this.onTabClosed(tabId, this.playerSources[index])
                    } 
                }
            })
        })
    }
}