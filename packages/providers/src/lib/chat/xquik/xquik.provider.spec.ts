import { ENDPOINT_TYPES, type ChannelData } from '@novu/stateless';
import { expect, test } from 'vitest';
import { safeOutboundJsonSpy } from '../../../utils/test/spy-safe-outbound';
import { XquikProvider } from './xquik.provider';

const TEST_DM_URL = 'https://api.xquik.com/api/v1/x/dm/1234567890123456789';

test('should trigger xquik library correctly', async () => {
  const { mockSafeOutboundJsonRequest } = safeOutboundJsonSpy();

  const provider = new XquikProvider({ apiKey: 'xquik-api-key' });
  const result = await provider.sendMessage({
    channelData: {
      endpoint: {
        url: TEST_DM_URL,
      },
      type: ENDPOINT_TYPES.WEBHOOK,
      identifier: 'test-webhook-identifier',
    },
    content: 'Hello world',
  });

  expect(mockSafeOutboundJsonRequest).toHaveBeenCalledWith({
    url: TEST_DM_URL,
    method: 'POST',
    headers: {
      Authorization: 'Bearer xquik-api-key',
    },
    body: {
      text: 'Hello world',
    },
  });
  expect(result.date).toBeDefined();
});

test('should trigger xquik library correctly with _passthrough', async () => {
  const { mockSafeOutboundJsonRequest } = safeOutboundJsonSpy();

  const provider = new XquikProvider({ apiKey: 'xquik-api-key' });

  await provider.sendMessage(
    {
      channelData: {
        endpoint: {
          url: TEST_DM_URL,
        },
        type: ENDPOINT_TYPES.WEBHOOK,
        identifier: 'test-webhook-identifier',
      },
      content: 'Hello world',
    },
    {
      _passthrough: {
        body: {
          text: 'passthrough message',
        },
      },
    }
  );

  expect(mockSafeOutboundJsonRequest).toHaveBeenCalledWith({
    url: TEST_DM_URL,
    method: 'POST',
    headers: {
      Authorization: 'Bearer xquik-api-key',
    },
    body: {
      text: 'passthrough message',
    },
  });
});

test('should reject non-webhook channel data', async () => {
  const provider = new XquikProvider({ apiKey: 'xquik-api-key' });

  await expect(
    provider.sendMessage({
      channelData: {
        endpoint: { userId: 'U123' },
        type: ENDPOINT_TYPES.LINE_USER,
        identifier: 'test-line-identifier',
      } as unknown as ChannelData,
      content: 'Hello world',
    })
  ).rejects.toThrow('Invalid channel data for Xquik provider');
});
