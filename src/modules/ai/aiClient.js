const logger = require('../../utils/logger');
const aiConfig = require('../../config/ai');

async function generateResponse(systemPrompt, userMessage) {
  const provider = aiConfig.provider;
  const key = aiConfig.apiKey;

  if (!provider || !key) {
    logger.warn('AI provider or API key not configured — AI responses unavailable');
    return null;
  }

  const model = aiConfig.model;
  const maxChars = aiConfig.maxResponseChars;

  if (provider === 'openai') {
    return callOpenAI(key, model, systemPrompt, userMessage, maxChars);
  }

  if (provider === 'anthropic') {
    return callAnthropic(key, model, systemPrompt, userMessage, maxChars);
  }

  logger.warn(`Unknown AI provider: ${provider}`);
  return null;
}

async function callOpenAI(apiKey, model, systemPrompt, userMessage, maxChars) {
  const { default: fetch } = await import('node-fetch');

  const body = {
    model: model || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    max_tokens: Math.min(Math.ceil(maxChars / 2), 2048),
  };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || '';
  return content.slice(0, maxChars);
}

async function callAnthropic(apiKey, model, systemPrompt, userMessage, maxChars) {
  const { default: fetch } = await import('node-fetch');

  const body = {
    model: model || 'claude-3-haiku-20240307',
    system: systemPrompt,
    messages: [
      { role: 'user', content: userMessage },
    ],
    max_tokens: Math.min(Math.ceil(maxChars / 2), 2048),
  };

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const content = data.content?.[0]?.text || '';
  return content.slice(0, maxChars);
}

module.exports = { generateResponse };
