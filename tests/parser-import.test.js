import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseConversation } from '../src/parser.js';

test('WhatsApp continuation is kept in the same message and counted', () => {
    const [first, second] = parseConversation(
        '[20/11/2026, 14:10:15] Alice: Salut\nNote: POURQUOI ? 🙂\n[20/11/2026, 14:12] Marc: Bonne question.'
    );
    assert.equal(first.text, 'Salut\nNote: POURQUOI ? 🙂');
    assert.equal(first.charCount, first.text.length);
    assert.equal(first.wordCount, 5);
    assert.equal(first.emojiCount, 1);
    assert.equal(first.isQuestion, true);
    assert.equal(first.hasAllCaps, true);
    assert.equal(second.sender, 'Marc');
});

test('Instagram text is ordered chronologically and attachments without text are ignored', () => {
    const messages = parseConversation(JSON.stringify({ messages: [
        { sender_name: 'Marc', timestamp_ms: 180000, content: 'Suite' },
        { sender_name: 'Alice', timestamp_ms: 120000, photos: [] },
        { sender_name: 'Alice', timestamp_ms: 60000, content: 'Début' },
    ] }));
    assert.deepEqual(messages.map(({ sender, text }) => [sender, text]), [['Alice', 'Début'], ['Marc', 'Suite']]);
    assert.equal(messages[0].timestampStr, '1970-01-01T00:01:00.000Z');
});

test('an unusable Instagram date does not discard its text', () => {
    const [message] = parseConversation(JSON.stringify({ messages: [
        { sender_name: 'Alice', timestamp_ms: 1e99, content: 'Texte préservé' },
    ] }));
    assert.equal(message.timestampStr, null);
    assert.equal(message.text, 'Texte préservé');
});
