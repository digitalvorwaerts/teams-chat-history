import { Client } from "@microsoft/microsoft-graph-client";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";

export function getGraphClient(msalInstance, account) {
  const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(msalInstance, {
    account: account,
    scopes: ["Chat.Read"],
    interactionType: "popup"
  });

  return Client.initWithMiddleware({
    authProvider
  });
}

export async function getRecentChats(graphClient) {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  
  try {
    const response = await graphClient
      .api('/me/chats')
      .filter(`lastModifiedDateTime gt ${yesterday}`)
      .expand('lastMessagePreview')
      .get();
    
    return extractTodos(response.value);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return [];
  }
}

function extractTodos(messages) {
  return messages
    .filter(msg => {
      const content = msg.lastMessagePreview?.body?.content || '';
      return content.includes('TODO') || content.includes('TASK');
    })
    .map(msg => ({
      id: msg.id,
      text: msg.lastMessagePreview.body.content,
      completed: false,
      timestamp: msg.lastModifiedDateTime
    }));
}
