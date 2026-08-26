import { ChatProviderIdEnum } from '@novu/shared';
import {
  ChannelTypeEnum,
  ENDPOINT_TYPES,
  IChatOptions,
  IChatProvider,
  ISendMessageSuccessResponse,
  isChannelDataOfType,
} from '@novu/stateless';
import { BaseProvider, CasingEnum } from '../../../base.provider';
import { safeChatWebhookJsonRequest } from '../../../utils/safe-chat-webhook-request';
import { WithPassthrough } from '../../../utils/types';

export class XquikProvider extends BaseProvider implements IChatProvider {
  id = ChatProviderIdEnum.Xquik;
  channelType = ChannelTypeEnum.CHAT as ChannelTypeEnum.CHAT;
  protected casing: CasingEnum = CasingEnum.CAMEL_CASE;

  constructor(private config: { apiKey?: string }) {
    super();
  }

  async sendMessage(
    data: IChatOptions,
    bridgeProviderData: WithPassthrough<Record<string, unknown>> = {}
  ): Promise<ISendMessageSuccessResponse> {
    if (!isChannelDataOfType(data.channelData, ENDPOINT_TYPES.WEBHOOK)) {
      throw new Error('Invalid channel data for Xquik provider');
    }

    const { channelData } = data;

    await safeChatWebhookJsonRequest({
      // The subscriber endpoint stores the full Xquik DM URL, e.g.
      // https://<xquik-host>/api/v1/x/dm/{recipientXUserId}.
      url: channelData.endpoint.url,
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: this.transform(bridgeProviderData, {
        text: data.content,
      }).body,
    });

    return {
      date: new Date().toISOString(),
    };
  }
}
