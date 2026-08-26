import { XquikProvider } from '@novu/providers';
import { ChatProviderIdEnum, ICredentials } from '@novu/shared';
import { ChannelTypeEnum } from '@novu/stateless';
import { BaseChatHandler } from './base.handler';

export class XquikHandler extends BaseChatHandler {
  constructor() {
    super(ChatProviderIdEnum.Xquik, ChannelTypeEnum.CHAT);
  }

  buildProvider(credentials: ICredentials) {
    this.provider = new XquikProvider({
      apiKey: credentials.apiKey as string,
    });
  }
}
