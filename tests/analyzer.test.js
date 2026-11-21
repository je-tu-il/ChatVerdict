import test from 'node:test';
import assert from 'node:assert/strict';
import { parseConversation } from '../src/parser.js';
import { analyzeConversation } from '../src/analyzer.js';

test('Parse WhatsApp iOS Chat format', () => {
    const raw = `
[21/11/2026, 14:10:00] Clara: Tu viens ce soir ?
[21/11/2026, 14:15:30] Lucas: Oui je finis le boulot et j'arrive vers 19h !
    `.trim();

    const msgs = parseConversation(raw);
    assert.strictEqual(msgs.length, 2);
    assert.strictEqual(msgs[0].sender, 'Clara');
    assert.strictEqual(msgs[0].text, 'Tu viens ce soir ?');
    assert.strictEqual(msgs[1].sender, 'Lucas');
    assert.strictEqual(msgs[1].text, "Oui je finis le boulot et j'arrive vers 19h !");
});

test('Parse Generic Dialogue format', () => {
    const raw = `
Alice: Tu te fais des films encore une fois !
Bob: Je ne me fais pas de films, regarde tes messages.
Alice: Laisse tomber t'es parano.
    `.trim();

    const msgs = parseConversation(raw);
    assert.strictEqual(msgs.length, 3);
    assert.strictEqual(msgs[0].sender, 'Alice');
    assert.strictEqual(msgs[1].sender, 'Bob');
});

test('Analyze Toxic Conversation & Tribunal Fault Determination', () => {
    const raw = `
Clara: Pourquoi tu as annulé notre soirée ?
Lucas: Tu te fais des films t'es folle j'ai jamais dit qu'on se voyait !
Clara: Mais si c'était prévu depuis mardi !
Lucas: Laisse tomber parle à un mur t'es conne.
    `.trim();

    const msgs = parseConversation(raw);
    const result = analyzeConversation(msgs);

    assert.ok(result !== null);
    assert.ok(result.toxicity.score > 40, 'Should detect significant toxicity');
    assert.strictEqual(result.tribunal.p2Name, 'Lucas');
    // Lucas should carry the majority fault
    assert.ok(result.tribunal.p2Fault > 60, 'Lucas should be judged as primarily at fault');
    assert.ok(result.tribunal.firstProvocation !== null);
    assert.strictEqual(result.tribunal.firstProvocation.sender, 'Lucas');
    assert.strictEqual(result.tribunal.firstProvocation.type, 'Gaslighting');
});

test('Analyze Wholesome & High Compatibility Conversation', () => {
    const raw = `
Sarah: Coucou ! Tu as bien dormi ? 🥰
Thomas: Coucou Sarah ! Oui super et toi ? Ta journée s'annonce bien ?
Sarah: Oui, hâte de te voir ce soir au restaurant !
Thomas: Moi aussi tellement hâte ! Je t'aime fort prends soin de toi.
    `.trim();

    const msgs = parseConversation(raw);
    const result = analyzeConversation(msgs);

    assert.ok(result !== null);
    assert.ok(result.compatibility.score >= 75, 'Should have high compatibility score');
    assert.strictEqual(result.toxicity.totalRedFlags, 0);
    assert.ok(result.toxicity.totalGreenFlags > 0);
});
