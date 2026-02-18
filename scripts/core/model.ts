import OpenAI from 'openai';

import { config } from './constants';

/**
 * Check whether an OpenAI API key is configured.
 * Use this before calling any AI-dependent function so that
 * commands which don't require AI (e.g. `format`) can run
 * without the key.
 */
export function isOpenAIAvailable(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

/**
 * Lazily-initialized OpenAI client singleton.
 * Created on first access so that commands which don't need AI
 * (e.g. `format`) can run without an OPENAI_API_KEY.
 */
let _openai: OpenAI | undefined;

export function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_PROXY_URL,
      maxRetries: 4,
    });
  }
  return _openai;
}

/** @deprecated Use getOpenAI() for lazy initialization */
export const openai = new Proxy({} as OpenAI, {
  get(_target, prop, receiver) {
    return Reflect.get(getOpenAI(), prop, receiver);
  },
});

/**
 * 调用 OpenAI Chat Completion API
 * @param messages 消息数组
 * @param options 可选参数
 * @returns 生成的回复内容
 */
export const callOpenAI = async (
  messages: Array<{ content: string; role: 'system' | 'user' | 'assistant' }>,
  options?: {
    model?: string;
    response_format?: { type: 'json_object' };
    temperature?: number;
  },
) => {
  const response = await getOpenAI().chat.completions.create({
    messages,
    model: options?.model || config.modelName,
    response_format: options?.response_format,
    temperature: options?.temperature ?? config.temperature,
  });

  return response.choices[0]?.message?.content || '';
};


