var TextArea;

chatObserver = new MutationObserver(function(mutations){
	mutations.forEach(function(mutation){
		//this is so that the addon doesn't try to work before the chat has loaded
		for(i=0; i<mutation.addedNodes.length; i++)
		{
			if(mutation.addedNodes[i].className === "ember-view chat-line admin" || mutation.addedNodes[i].className === "ember-view chat-line" || 
				mutation.addedNodes[i].className === "chat-line admin" || mutation.addedNodes[i].className === "chat-line") 
			{
				textArea = document.getElementsByClassName("ember-view ember-text-area mousetrap")[0];

				linesObserver.observe(mutation.addedNodes[i].parentNode, {childList: true});
				chatObserver.disconnect();
			}
		}

	});
});

linesObserver = new MutationObserver(function(mutations){
	mutations.forEach(function(mutation){

		//observers will almost always return added nodes one node at a time, but just to be safe
		for(k = 0; k<mutation.addedNodes.length; k++)
		{
			var isMessage = false;
			if(mutation.addedNodes[k].className === "ember-view chat-line admin" || mutation.addedNodes[k].className === "ember-view chat-line")
			{
				isMessage = true;
				mutation.addedNodes[k].onclick = function()
				{
					var message = this.getElementsByClassName("message")[0];	
					textArea.value = getRawMessage(message);
				}
			}

			//shoutout to BetterTTV
			else if(mutation.addedNodes[k].className === "chat-line admin" || mutation.addedNodes[k].className === "chat-line")
			{
				isMessage = true;
				mutation.addedNodes[k].onclick = function()
				{
					var message = this.getElementsByClassName("message")[0];
					textArea.value = decodeURIComponent(message.getAttribute('data-raw'));
				}
			}

			else if(mutation.addedNodes[k].className === "ember-view chat-line action")
			{
				isMessage = true;
				mutation.addedNodes[k].onclick = function()
				{
					var message = this.getElementsByClassName("message")[0];
					textArea.value = "/me " + getRawMessage(message);
				}
			}

			else if(mutation.addedNodes[k].className === "chat-line action")
			{
				isMessage = true;
				mutation.addedNodes[k].onclick = function()
				{
					var message = this.getElementsByClassName("message")[0];
					textArea.value = "/me " + decodeURIComponent(message.getAttribute('data-raw'));
				}
			}

			if( isMessage === true && mutation.addedNodes[k].getElementsByClassName("message").textContent !== null)
			{
				mutation.addedNodes[k].onmouseover = function()
				{
					this.getElementsByClassName("message")[0].style.textDecoration = 'underline';
				}

				mutation.addedNodes[k].onmouseout = function()
				{
					this.getElementsByClassName("message")[0].style.textDecoration = 'none';
				}
				mutation.addedNodes[k].getElementsByClassName("message")[0].style.cursor = 'pointer';
			}
			
		}

	});
});

var getRawMessage = function(message)
{
	var rawMessage = "";
	for(i = 0; i < message.childNodes.length; i++)
	{
		//emotes
		if(message.childNodes[i].tagName == "IMG") rawMessage += message.childNodes[i].getAttribute('alt');
		//links
		else if(message.childNodes[i].tagName == 'A') rawMessage += message.childNodes[i].getAttribute('href');
		//text
		else rawMessage += message.childNodes[i].data;
	}
	return rawMessage;
}

chatObserver.observe(document.body, {childList: true, subtree: true});