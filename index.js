const minWidth = 380,
    startHeight = 400,
    defaultSettings = {
        resize: true,
        mobileWidth: 650,
        canOpenNewWindows: true
    } 

export default class MetaRIBBITConnect {
    settings = {}

    CONNECTEvents = ['launch','exit','complete','bankLoginSelected','manualEnrollmentSelected','noAccountsFound','bankNotFound','bankLogin','linkOpen']

    #messageCallbacks = []
    #width = minWidth
    #height = startHeight
    #style = null
    #initialized = false

    constructor({
        token,
        language = 'en',
        width = minWidth,
        settings,
        inline,
        environment='Production',
        environmentOverrideURL
    }){
        this.token = token
        this.id = 'RIBBIT-' + this.token
        this.settings = { ...defaultSettings, ...settings }
        this.#width = width > minWidth ? width : minWidth
        this.isMobile = window.innerWidth <= this.settings.mobileWidth
        this.isInline = inline === true ? true : false;
        this.language = language;
        this.environment = environment;
        this.environmentOverrideURL = environmentOverrideURL;
        if(!settings || settings.resize == null) this.settings.resize = this.isInline

        if(!this.#initialized) this.initFrame();
        this.sendMessage('isMobile', this.isMobile)
        this.sendMessage('isInline', this.isInline)
        if(!this.isMobile && this.settings.resize == false) this.#height = Math.min(640, window.innerHeight * .9);
        this.#applyStyles();
    }

    initFrame = () => {
        this.#initialized = true
        const iFrame = document.createElement('iframe')
        //const server = 'https://localhost:44345'

        let server = ''
        if(!this.environmentOverrideURL){
            switch(this.environment){
                case 'Production': server = 'https://portal.ribbit.ai'; break;
                case 'Development': server = 'https://playground.ribbit.ai'; break;
                case 'Test': server = 'https://test.ribbit.ai'; break;
                case 'Staging': server = 'https://test.ribbit.ai'; break;
            }
        } else {
            server = this.environmentOverrideURL;
        }


        this.iFrameMessageKey = new Date().getTime() + ''
        iFrame.setAttribute('src', server+'/CONNECT/Frame?token=' + this.token + '&language=' + this.language + '&messagekey=' + this.iFrameMessageKey)
        iFrame.id = this.id
        this.iFrame = iFrame
        this.updateClassName()

        this.#handleMessages()
        this.#initStyles()
        this.#applyStyles()

        window.addEventListener('resize', e => {
            let isMobile = window.innerWidth <= this.settings.mobileWidth
            this.sendMessage('resize', { width: window.innerWidth, height: window.innerHeight })

            if(isMobile != this.isMobile) {
                this.isMobile = isMobile
                this.sendMessage('isMobile', this.isMobile)
                this.updateClassName()
            }
        }, true);
    }

    onCallbacks = []
    on = (eventName, callback) => {
        this.onCallbacks.push({ eventName, callback })
    }

    updateClassName = () => {
        this.iFrame.className = 'RIBBIT-iFrame' + (this.isMobile ? ' mobile' : '')
    }

    #initStyles = () => {
        this.#style = document.createElement('style');
        this.#style.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(this.#style);
    }

    #applyStyles = () => {
        const css = `
            #${this.id} {
                height: ${this.#height}px;
                width: ${this.#width}px;
            }
        `

        if(this.#style.styleSheet){
            this.#style.styleSheet.cssText = css;
        }else{
            this.#style.innerHTML = '';
            this.#style.appendChild(document.createTextNode(css));
        }
    }

    sendMessage = (functionName, message) => {
        let frame = document.getElementById(this.id)
        if(!frame) return;
        frame.contentWindow.postMessage({
            'function': functionName,
            message
        }, "*");
    }

    #handleMessages = () => {
        window.removeEventListener("message", this.#messageHandler);
        window.addEventListener("message", this.#messageHandler, false);
    }

    #messageHandler = (e) => {
        const functionName = e.data.function,
            message = e.data.message,
            key = e.data.key;

        if(!functionName) return;
        if(key !== this.iFrameMessageKey) return;

        switch(functionName){
            case 'heightChange':
                if(this.settings.resize == false) return;
                this.#height = message;
                this.#applyStyles();
                break;
            case 'openLink':
                if(this.settings.canOpenNewWindows) window.open(message, '_blank').focus();
                else this.onCallbacks.filter(x => x.eventName == 'linkOpen').map(x => x.callback(message))
                break;
            case 'CONNECTEvent':
                this.#messageCallbacks.map(f => f(functionName, message))
                this.onCallbacks.filter(x => x.eventName == message.name).map(x => x.callback(message))
                break;
            case 'environmentCheck':
                this.sendMessage('isMobile', window.innerWidth <= this.settings.mobileWidth)
                this.sendMessage('isInline', this.isInline)
                break;
        }
    }

    onMessage = (callback) => { // outside event
        this.#messageCallbacks.push(callback)
    }

}
