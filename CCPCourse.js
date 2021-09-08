function loadCCP() {
    // Importing the DOM elements into variables to be used
    var container = document.getElementById("ccpContainer");
    var attributesDiv = document.getElementById("attributesDiv");
    var agentStatusDiv = document.getElementById("agentStatusDiv");
    var offlineButton = document.getElementById("setOffline");
    var readyButton = document.getElementById("setReady");
    var answerButton = document.getElementById("ansCall");
    var dropButton = document.getElementById("dropCall");
    var firstNameField = document.getElementById("firstName");
    var lastNameField = document.getElementById("lastName");
    var customerNumberField = document.getElementById("customerNumber");
    var logtextarea = document.getElementById("logtextarea");
    var transferButton = document.getElementById("transfer");
    var conferenceButton = document.getElementById("conference");

    window.myCPP = window.myCPP || {};

    //replace with the CCP URL for your Amazon Connect instance
    //var ccpUrl = "https://londonbootcampnov19test.awsapps.com/connect/ccp#/";
	//var ccpUrl = "https://londonbootcampnov19test.awsapps.com/connect/ccp#/";
	//var ccpUrl = "https://abp3jhk.my.connect.aws/ccp-2/";
    var ccpUrl = "https://abp3jhk.awsapps.com/connect/ccp-v2/";
  
    // Initialize the CCP window
    connect.core.initCCP(container, {
        ccpUrl: ccpUrl,        
        loginPopup: true,
        loginPopupAutoClose: true,        
        softphone: {
            allowFramedSoftphone: true
        }
    });

    //화면상의 텍스트 영역에 로그 출력하기
	function writeLog(message) {
			var logtextarea = document.getElementById('logtextarea');
			var text = logtextarea.value;
			logtextarea.value = text + message;
	};
    
    // Call the subscribe to Streams API events, Contact and Agent
    connect.contact(subscribeToContactEvents);
    connect.agent(subscribeToAgentEvents);

    function subscribeToContactEvents(contact) {
        // Subscribing to Streams API Long Polling Contact events
        window.myCPP.contact = contact;
        //window 현재 화면, myCPP.contact 데이터를 넣는다.
        console.log(window.myCPP);
        writeLog('window.myCPP = ' + window.myCPP[0] + '\n');

        console.log('Subscribing to contact events');
        if (contact.getActiveInitialConnection()
            && contact.getActiveInitialConnection().getEndpoint()) { 
            console.log('New contact is from: '+ contact.getActiveInitialConnection().getEndpoint().phoneNumber);
            setButtonUi('Ringing');
            showAttributes(contact);
        } else {
            console.log('Contact already exists');
        }
        console.log('Contact is from queue'+ contact.getQueue().name);
        console.log('Contact attributes are ' + JSON.stringify(contact.getAttributes()));
        contact.onIncoming(handleContactIncoming);
        contact.onAccepted(handleContactAccepted);
        contact.onConnected(handleContactConnected);
        contact.onEnded(handleContactEnded);
    }

    function handleContactIncoming(contact) {
        if (contact) {
            writeLog('인바운드 콜이 인입. （connect.onIncoming!\n');
            console.log('[contact.onIncoming] Contact is incoming');
        } else {
            console.log('[contact.onIncoming] Contact is incoming. Null contact passed to event handler');
        }
    }

    function handleContactAccepted(contact) {
        if (contact) {
            console.log('[contact.onAccepted] Contact accepted by agent. Contact state is ' + contact.getStatus().type);
        } else {
            console.log('[contact.onAccepted] Contact accepted by agent. Null contact passed to event handler');
        }
    }

    function handleContactConnected(contact) {
        if (contact) {
            console.log('[contact.onConnected] Contact connected to agent. Contact state is ' + contact.getStatus().type);
        } else {
            console.log('[contact.onConnected] Contact connected to agent. Null contact passed to event handler');
        }
    }

    function handleContactEnded(contact) {
        if (contact) {
            console.log('[contact.onEnded] Contact has ended. Contact state is ' + contact.getStatus().type);
        } else {
            console.log('[contact.onEnded] Contact has ended. Null contact passed to event handler');
        }
    }

    function subscribeToAgentEvents(agent) {
        // Subscribing to Streams API Long Polling Agent events
        window.myCPP.agent = agent;
        agent.onRefresh(handleAgentRefresh);
        agent.onRoutable(handleAgentRoutable);
        agent.onNotRoutable(handleAgentNotRoutable);
        agent.onOffline(handleAgentOffline);
        agent.onStateChange(handleAgentStateChange);
        // Set the DOM button elements behaviour 
        $("#setReady").click(() => {
            goAvailable();
        });

        $("#setOffline").click(() => {
            goOffline();
        });
        
        $("#dropCall").click(() => {
            disconnectContact();
        });

        $("#ansCall").click(() => {
            acceptContact();
        });

        $("#transfer").click(() => {
            transferContact();
        });

        $("#conference").click(() => {
            confContact();
        });

        $("#makeCall").click(() => {
            makeCall();
        });
       
        
    }
    // We will log in the browsers console any new agent status
    function handleAgentStateChange(agent) {
        console.log('[agent.onStateChange] Agent state changed. New state is ' + agent.newState);
        displayAgentStatus(agent.newState);
        setButtonUi(agent.newState);
    }
    function displayAgentStatus(status) {
        agentStatusDiv.innerHTML = 'Agent Status: <span style="font-weight: bold">' + status + '</span>';
    }

    function handleAgentRefresh(agent) {
        console.log('[agent.onRefresh] Agent data refreshed. Agent status is ' + agent.getStatus().name);
    }

    function handleAgentRoutable(agent) {
        console.log('[agent.onRoutable] Agent is routable. Agent status is ' + agent.getStatus().name);
    }

    function handleAgentNotRoutable(agent) {
        console.log('[agent.onNotRoutable] Agent is online, but not routable. Agent status is ' + agent.getStatus().name);
    }

    function handleAgentOffline(agent) {
        console.log('[agent.onOffline] Agent is offline. Agent status is ' + agent.getStatus().name);
    }

    function setButtonUi(state) {
        // Based on the state parameter received, we will update the DOM elements UI appearance and behaviour
        switch (state) {
            case 'AfterCallWork': // same UI behavior for ACW and Available states
            case 'Available':
                // Enabling Set Offline button
                offlineButton.style.backgroundColor = '#000000';
                offlineButton.style.color = '#FFFFFF';
                // Disabling Set Ready, Answer Call and Drop Call buttons
                readyButton.style.backgroundColor = '#FFFFFF';
                readyButton.style.color = '#000000';
                dropButton.style.backgroundColor = '#FFFFFF';
                dropButton.style.color = '#000000';
                answerButton.style.backgroundColor = '#FFFFFF';
                answerButton.style.color = '#000000';
                firstNameField.value = '';
                lastNameField.value = '';
                offlineButton.disabled = false;
                answerButton.disabled = true;
                readyButton.disabled = true;
                dropButton.disabled = true;
                attributesDiv.hidden = true;
                break;
            case 'Offline':
                // Enabling Set Ready button
                readyButton.style.backgroundColor = '#0000FF';
                readyButton.style.color = '#FFFFFF';
                // Disabling Set Offline, Answer Call and Drop Call buttons
                offlineButton.style.backgroundColor = '#FFFFFF';
                offlineButton.style.color = '#000000';
                dropButton.style.backgroundColor = '#FFFFFF';
                dropButton.style.color = '#000000';
                answerButton.style.backgroundColor = '#FFFFFF';
                answerButton.style.color = '#000000';
                readyButton.disabled = false;
                answerButton.disabled = true;
                dropButton.disabled = true;
                offlineButton.disabled = true;
                attributesDiv.hidden = true;
                break;
            case 'Ringing':
                // Enabling Answer Call button
                answerButton.style.backgroundColor = '#008000';
                answerButton.style.color = '#FFFFFF';
                // Disabling Set Offline, Answer Call and Drop Call buttons
                offlineButton.style.backgroundColor = '#FFFFFF';
                offlineButton.style.color = '#000000';
                dropButton.style.backgroundColor = '#FFFFFF';
                dropButton.style.color = '#000000';
                readyButton.style.backgroundColor = '#FFFFFF';
                readyButton.style.color = '#000000';
                answerButton.disabled = false;
                dropButton.disabled = true;
                readyButton.disabled = true;
                offlineButton.disabled = true;
                attributesDiv.hidden = false;
                break;
            case 'Busy':
            //case 'Connected':
                // Enabling Answer Call button
                dropButton.style.backgroundColor = '#FF0000';
                dropButton.style.color = '#FFFFFF';
                // Disabling Set Offline, Answer Call and Drop Call buttons
                offlineButton.style.backgroundColor = '#FFFFFF';
                offlineButton.style.color = '#000000';
                readyButton.style.backgroundColor = '#FFFFFF';
                readyButton.style.color = '#000000';
                answerButton.style.backgroundColor = '#FFFFFF';
                answerButton.style.color = '#000000';
                dropButton.disabled = false;
                answerButton.disabled = true;
                readyButton.disabled = true;
                offlineButton.disabled = true;
                attributesDiv.hidden = false;
                break;
        }
    }

    function goAvailable() {
        // Streams API call to the first Routable state availale to the Agent
        // Logging results to the console and setting the DOM button UI to the 'Available' state
        var routableState = window.myCPP.agent.getAgentStates().filter(function (state) {
            return state.type === connect.AgentStateType.ROUTABLE;
        })[0];
        window.myCPP.agent.setState(routableState, {
            success: function () {
                console.log('Set agent status to Available via Streams');
            },
            failure: function () {
                console.log('Failed to set agent status to Available via Streams');
            }
        });
    }

    function goOffline() {
        // Streams API call to the first Offline state availale to the Agent
        // Logging results to the console and setting the DOM button UI to the 'Offline' state
        var offlineState = window.myCPP.agent.getAgentStates().filter(function (state) {
            return state.type === connect.AgentStateType.OFFLINE;
        })[0];
        window.myCPP.agent.setState(offlineState, {
            success: function () {
                console.log('Succesfully set agent status to Offline via Streams');
            },
            failure: function () {
                console.log('Failed to set agent status to Offline via Streams');
            }
        });
    }

    function acceptContact() {
        // Streams API call to Accept the Incoming Contact
        window.myCPP.contact.accept({
            success: function () {
                console.log('Accepted via Streams');
            },
            failure: function () {
                console.log('Failed to establish connection via Streams');
            }
        });
    }
    
    function disconnectContact() {
        // Streams API call to Drop a Connected Contact
        window.myCPP.contact.getAgentConnection().destroy({
            success: function () {
                console.log('Contact disconnected via Streams');
            },
            failure: function () {
                console.log('Failed to disconnect the contact via Streams');
            }
        });
    }

    function transferContact() {
        // Streams API call to Transfer to Anthoer 
        window.myCPP.contact.accept({
            success: function () {
                console.log('Accepted via Streams');
            },
            failure: function () {
                console.log('Failed to establish connection via Streams');
            }
        });
    }

    function makeCall() {
        // Streams API call to make a call
        var agent = new lily.Agent(); 
        agent.connect(connect.Endpoint.byPhoneNumber("+19293573151"),{});
        agent.toSnapshot();        
    }
    

    function showAttributes(contact) {
        // Gathers received CTR Contact Atrtributes, and displays them with the Contacts Phone Number
        var attributes = contact.getAttributes();
        customerNumberField.value = contact.getActiveInitialConnection().getEndpoint().phoneNumber;
        
        if(attributes.Name) {
            firstNameField.value = attributes.Name.value;
        }
        if(attributes.Surname) {
            lastNameField.value = attributes.Surname.value;
        }
        attributesDiv.hidden = false;
    }
}
$(document).ready(loadCCP);