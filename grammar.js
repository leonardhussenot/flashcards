// 5-page minimalist grammar cheat sheets for German (DE) and French (FR)

const GERMAN_PAGES = [
  {
    title: 'Cases & Articles',
    html: `
      <div class="g-card">
        <h3 class="g-heading">Definite · der / die / das</h3>
        <table class="g-table">
          <thead>
            <tr><th></th><th>M</th><th>F</th><th>N</th><th>Pl</th></tr>
          </thead>
          <tbody>
            <tr>
              <th>Nom</th>
              <td>de<b>r</b></td>
              <td>di<b>e</b></td>
              <td>da<b>s</b></td>
              <td>di<b>e</b></td>
            </tr>
            <tr>
              <th>Akk</th>
              <td class="cell-accent">de<b>n</b></td>
              <td>di<b>e</b></td>
              <td>da<b>s</b></td>
              <td>di<b>e</b></td>
            </tr>
            <tr>
              <th>Dat</th>
              <td class="cell-accent">de<b>m</b></td>
              <td class="cell-accent">de<b>r</b></td>
              <td class="cell-accent">de<b>m</b></td>
              <td class="cell-accent">de<b>n</b> <span class="g-note">+n</span></td>
            </tr>
            <tr>
              <th>Gen</th>
              <td class="cell-accent">de<b>s</b> <span class="g-note">+s</span></td>
              <td class="cell-accent">de<b>r</b></td>
              <td class="cell-accent">de<b>s</b> <span class="g-note">+s</span></td>
              <td class="cell-accent">de<b>r</b></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="g-card">
        <h3 class="g-heading">Indefinite · ein / kein / mein</h3>
        <table class="g-table">
          <thead>
            <tr><th></th><th>M</th><th>F</th><th>N</th><th>Pl</th></tr>
          </thead>
          <tbody>
            <tr>
              <th>Nom</th>
              <td>ein</td>
              <td>ein<b>e</b></td>
              <td>ein</td>
              <td>kein<b>e</b></td>
            </tr>
            <tr>
              <th>Akk</th>
              <td class="cell-accent">ein<b>en</b></td>
              <td>ein<b>e</b></td>
              <td>ein</td>
              <td>kein<b>e</b></td>
            </tr>
            <tr>
              <th>Dat</th>
              <td class="cell-accent">ein<b>em</b></td>
              <td class="cell-accent">ein<b>er</b></td>
              <td class="cell-accent">ein<b>em</b></td>
              <td class="cell-accent">kein<b>en</b> <span class="g-note">+n</span></td>
            </tr>
            <tr>
              <th>Gen</th>
              <td class="cell-accent">ein<b>es</b> <span class="g-note">+s</span></td>
              <td class="cell-accent">ein<b>er</b></td>
              <td class="cell-accent">ein<b>es</b> <span class="g-note">+s</span></td>
              <td class="cell-accent">kein<b>er</b></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="g-card g-compact-list">
        <div><b>Nom</b> — Subject (<i>wer/was?</i>) · <i>sein, werden, bleiben</i></div>
        <div><b>Akk</b> — Direct object (<i>wen/was?</i>) · motion (<i>wohin?</i>)</div>
        <div><b>Dat</b> — Indirect (<i>wem?</i>) · location (<i>wo?</i>) · <i>helfen, danken, gefallen, folgen</i></div>
        <div><b>Gen</b> — Possession (<i>wessen?</i>)</div>
      </div>
    `
  },
  {
    title: 'Adjective Endings',
    html: `
      <div class="g-card">
        <h3 class="g-heading">After der / die / das <span class="g-sub">(dieser, jeder, alle)</span></h3>
        <table class="g-table">
          <thead>
            <tr><th></th><th>M</th><th>F</th><th>N</th><th>Pl</th></tr>
          </thead>
          <tbody>
            <tr>
              <th>Nom</th>
              <td class="cell-accent"><b>-e</b></td>
              <td class="cell-accent"><b>-e</b></td>
              <td class="cell-accent"><b>-e</b></td>
              <td>-en</td>
            </tr>
            <tr>
              <th>Akk</th>
              <td>-en</td>
              <td class="cell-accent"><b>-e</b></td>
              <td class="cell-accent"><b>-e</b></td>
              <td>-en</td>
            </tr>
            <tr>
              <th>Dat</th>
              <td>-en</td><td>-en</td><td>-en</td><td>-en</td>
            </tr>
            <tr>
              <th>Gen</th>
              <td>-en</td><td>-en</td><td>-en</td><td>-en</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="g-card">
        <h3 class="g-heading">After ein / kein / mein</h3>
        <table class="g-table">
          <thead>
            <tr><th></th><th>M</th><th>F</th><th>N</th><th>Pl</th></tr>
          </thead>
          <tbody>
            <tr>
              <th>Nom</th>
              <td class="cell-accent"><b>-er</b></td>
              <td class="cell-accent"><b>-e</b></td>
              <td class="cell-accent"><b>-es</b></td>
              <td>-en</td>
            </tr>
            <tr>
              <th>Akk</th>
              <td>-en</td>
              <td class="cell-accent"><b>-e</b></td>
              <td class="cell-accent"><b>-es</b></td>
              <td>-en</td>
            </tr>
            <tr>
              <th>Dat</th>
              <td>-en</td><td>-en</td><td>-en</td><td>-en</td>
            </tr>
            <tr>
              <th>Gen</th>
              <td>-en</td><td>-en</td><td>-en</td><td>-en</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="g-card">
        <h3 class="g-heading">No Article <span class="g-sub">(mirrors der/die/das)</span></h3>
        <table class="g-table">
          <thead>
            <tr><th></th><th>M</th><th>F</th><th>N</th><th>Pl</th></tr>
          </thead>
          <tbody>
            <tr>
              <th>Nom</th>
              <td><b>-er</b></td><td><b>-e</b></td><td><b>-es</b></td><td><b>-e</b></td>
            </tr>
            <tr>
              <th>Akk</th>
              <td><b>-en</b></td><td><b>-e</b></td><td><b>-es</b></td><td><b>-e</b></td>
            </tr>
            <tr>
              <th>Dat</th>
              <td><b>-em</b></td><td><b>-er</b></td><td><b>-em</b></td><td><b>-en</b></td>
            </tr>
            <tr>
              <th>Gen</th>
              <td class="cell-accent"><b>-en</b></td><td><b>-er</b></td><td class="cell-accent"><b>-en</b></td><td><b>-er</b></td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  },
  {
    title: 'Pronouns',
    html: `
      <div class="g-card">
        <h3 class="g-heading">Personal &amp; Possessive</h3>
        <table class="g-table g-table-left">
          <thead>
            <tr><th>Nom</th><th>Akk</th><th>Dat</th><th>Poss.</th></tr>
          </thead>
          <tbody>
            <tr><td><b>ich</b></td><td>mich</td><td>mir</td><td>mein-</td></tr>
            <tr><td><b>du</b></td><td>dich</td><td>dir</td><td>dein-</td></tr>
            <tr><td><b>er</b></td><td class="cell-accent">ihn</td><td class="cell-accent">ihm</td><td>sein-</td></tr>
            <tr><td><b>sie</b></td><td>sie</td><td class="cell-accent">ihr</td><td>ihr-</td></tr>
            <tr><td><b>es</b></td><td>es</td><td class="cell-accent">ihm</td><td>sein-</td></tr>
            <tr><td><b>wir</b></td><td>uns</td><td>uns</td><td>unser-</td></tr>
            <tr><td><b>ihr</b></td><td>euch</td><td>euch</td><td>euer-</td></tr>
            <tr><td><b>sie / Sie</b></td><td>sie / Sie</td><td class="cell-accent">ihnen / Ihnen</td><td>ihr- / Ihr-</td></tr>
          </tbody>
        </table>
      </div>

      <div class="g-card g-compact-list">
        <h3 class="g-heading">Reflexive · sich</h3>
        <div><b>ich / du</b> → mich, dich <i>(Akk)</i> · mir, dir <i>(Dat)</i></div>
        <div><b>wir / ihr</b> → uns · euch</div>
        <div><b>er / sie / es / sie / Sie</b> → always <b>sich</b></div>
      </div>
    `
  },
  {
    title: 'Prepositions',
    html: `
      <div class="g-card g-compact-list">
        <h3 class="g-heading">Always Akkusativ</h3>
        <div class="g-chips">
          <span><b>durch</b> through</span>
          <span><b>für</b> for</span>
          <span><b>gegen</b> against</span>
          <span><b>ohne</b> without</span>
          <span><b>um</b> around/at</span>
          <span><b>bis</b> until</span>
        </div>
      </div>

      <div class="g-card g-compact-list">
        <h3 class="g-heading">Always Dativ</h3>
        <div class="g-chips">
          <span><b>aus</b> from/out</span>
          <span><b>bei</b> at/near</span>
          <span><b>mit</b> with</span>
          <span><b>nach</b> after/to</span>
          <span><b>seit</b> since</span>
          <span><b>von</b> from/of</span>
          <span><b>zu</b> to</span>
          <span><b>gegenüber</b> opposite</span>
        </div>
      </div>

      <div class="g-card g-compact-list">
        <h3 class="g-heading">Two-Way · Akk (wohin? →) vs. Dat (wo? •)</h3>
        <div class="g-chips">
          <span><b>an</b></span>
          <span><b>auf</b></span>
          <span><b>hinter</b></span>
          <span><b>in</b></span>
          <span><b>neben</b></span>
          <span><b>über</b></span>
          <span><b>unter</b></span>
          <span><b>vor</b></span>
          <span><b>zwischen</b></span>
        </div>
        <div class="g-divider"></div>
        <div class="g-muted-line"><b>im</b> = in dem · <b>ins</b> = in das · <b>am</b> = an dem · <b>ans</b> = an das · <b>zum</b> = zu dem · <b>zur</b> = zu der · <b>vom</b> = von dem · <b>beim</b> = bei dem</div>
      </div>

      <div class="g-card g-compact-list">
        <h3 class="g-heading">Genitiv</h3>
        <div class="g-chips">
          <span><b>wegen</b> because of</span>
          <span><b>während</b> during</span>
          <span><b>trotz</b> despite</span>
          <span><b>statt</b> instead of</span>
        </div>
      </div>
    `
  },
  {
    title: 'Word Order & Verbs',
    html: `
      <div class="g-card g-compact-list">
        <h3 class="g-heading">Verb Placement</h3>
        <div><b>Main clause (V2)</b> — Verb stays in <b>position 2</b>; prefix, participle &amp; infinitive go to the <b>end</b>.<br/><span class="g-muted-line">Heute <b>rufe</b> ich dich <b>an</b>.</span></div>
        <div><b>Verb-end triggers</b> — <i>dass, weil, obwohl, wenn, als, ob, bevor, nachdem, während, damit</i><br/><span class="g-muted-line">…, weil ich heute müde <b>bin</b>.</span></div>
        <div><b>Keep V2 (pos. 0)</b> — <i>und, oder, aber, denn, sondern</i></div>
      </div>

      <div class="g-card g-compact-list">
        <h3 class="g-heading">Sentence Order</h3>
        <div><b>TeKaMoLo</b> — Time (<i>wann</i>) → Cause (<i>warum</i>) → Manner (<i>wie</i>) → Place (<i>wo/wohin</i>)</div>
        <div><b>Objects</b> — Nouns: <b>Dat → Akk</b> · If Akk is a pronoun: <b>Akk → Dat</b> (<i>ich gebe es ihm</i>)</div>
      </div>

      <div class="g-card">
        <h3 class="g-heading">Core Auxiliaries</h3>
        <table class="g-table g-table-left">
          <thead>
            <tr><th></th><th>sein</th><th>haben</th><th>werden</th></tr>
          </thead>
          <tbody>
            <tr><th>ich</th><td>bin</td><td>habe</td><td>werde</td></tr>
            <tr><th>du</th><td>bist</td><td>hast</td><td>wirst</td></tr>
            <tr><th>er/sie/es</th><td>ist</td><td>hat</td><td>wird</td></tr>
            <tr><th>wir / sie</th><td>sind</td><td>haben</td><td>werden</td></tr>
            <tr><th>ihr</th><td>seid</td><td>habt</td><td>werdet</td></tr>
          </tbody>
        </table>
      </div>
    `
  }
];

const FRENCH_PAGES = [
  {
    title: 'Articles & Partitives',
    html: `
      <div class="g-card">
        <h3 class="g-heading">Definite, Indefinite &amp; Partitive</h3>
        <table class="g-table">
          <thead>
            <tr><th></th><th>Masc</th><th>Fem</th><th>Vowel / h</th><th>Plural</th></tr>
          </thead>
          <tbody>
            <tr>
              <th>Def.</th>
              <td><b>le</b></td>
              <td><b>la</b></td>
              <td class="cell-accent"><b>l’</b></td>
              <td><b>les</b></td>
            </tr>
            <tr>
              <th>Indef.</th>
              <td><b>un</b></td>
              <td><b>une</b></td>
              <td>un / une</td>
              <td><b>des</b></td>
            </tr>
            <tr>
              <th>Some</th>
              <td class="cell-accent"><b>du</b></td>
              <td>de la</td>
              <td class="cell-accent"><b>de l’</b></td>
              <td class="cell-accent"><b>des</b></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="g-card">
        <h3 class="g-heading">Mandatory Contractions · à &amp; de</h3>
        <table class="g-table">
          <thead>
            <tr><th></th><th>+ le</th><th>+ les</th><th>+ la</th><th>+ l’</th></tr>
          </thead>
          <tbody>
            <tr>
              <th>à</th>
              <td class="cell-accent"><b>au</b></td>
              <td class="cell-accent"><b>aux</b></td>
              <td>à la</td>
              <td>à l’</td>
            </tr>
            <tr>
              <th>de</th>
              <td class="cell-accent"><b>du</b></td>
              <td class="cell-accent"><b>des</b></td>
              <td>de la</td>
              <td>de l’</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="g-card g-compact-list">
        <h3 class="g-heading">Negation Rule · pas de</h3>
        <div>After negation, <i>un, une, du, de la, des</i> all become <b>de / d’</b> (except after <i>être</i>).</div>
        <div class="g-muted-line">J’ai du temps → Je n’ai <b>pas de</b> temps · Pas <b>d’</b>eau</div>
      </div>
    `
  },
  {
    title: 'Pronouns & Order',
    html: `
      <div class="g-card">
        <h3 class="g-heading">Personal, Object &amp; Stressed</h3>
        <table class="g-table g-table-left">
          <thead>
            <tr><th>Subj.</th><th>Direct</th><th>Indirect</th><th>Stressed</th></tr>
          </thead>
          <tbody>
            <tr><td><b>je</b></td><td>me / m’</td><td>me / m’</td><td>moi</td></tr>
            <tr><td><b>tu</b></td><td>te / t’</td><td>te / t’</td><td>toi</td></tr>
            <tr><td><b>il / elle</b></td><td class="cell-accent">le / la / l’</td><td class="cell-accent">lui</td><td>lui / elle</td></tr>
            <tr><td><b>nous</b></td><td>nous</td><td>nous</td><td>nous</td></tr>
            <tr><td><b>vous</b></td><td>vous</td><td>vous</td><td>vous</td></tr>
            <tr><td><b>ils / elles</b></td><td class="cell-accent">les</td><td class="cell-accent">leur</td><td>eux / elles</td></tr>
          </tbody>
        </table>
      </div>

      <div class="g-card g-compact-list">
        <h3 class="g-heading">y vs. en</h3>
        <div><b>y</b> — replaces <b>à + thing / place</b> (<i>J’<b>y</b> vais · J’<b>y</b> pense</i>)</div>
        <div><b>en</b> — replaces <b>de + thing</b> or quantities (<i>J’<b>en</b> veux deux · J’<b>en</b> parle</i>)</div>
      </div>

      <div class="g-card g-compact-list">
        <h3 class="g-heading">Order Before the Verb</h3>
        <div class="g-chips">
          <span>1. me/te/se/nous/vous</span>
          <span>2. <b>le/la/les</b></span>
          <span>3. <b>lui/leur</b></span>
          <span>4. <b>y</b></span>
          <span>5. <b>en</b></span>
        </div>
        <div class="g-muted-line">Il <b>me le</b> donne · Je <b>lui en</b> parle</div>
      </div>
    `
  },
  {
    title: 'Core Verbs & Present',
    html: `
      <div class="g-card">
        <h3 class="g-heading">Essential Irregulars</h3>
        <table class="g-table">
          <thead>
            <tr><th></th><th>être</th><th>avoir</th><th>aller</th><th>faire</th></tr>
          </thead>
          <tbody>
            <tr><th>je</th><td>suis</td><td>ai</td><td class="cell-accent">vais</td><td>fais</td></tr>
            <tr><th>tu</th><td>es</td><td>as</td><td>vas</td><td>fais</td></tr>
            <tr><th>il/on</th><td>est</td><td>a</td><td>va</td><td>fait</td></tr>
            <tr><th>nous</th><td class="cell-accent">sommes</td><td>avons</td><td>allons</td><td>faisons</td></tr>
            <tr><th>vous</th><td class="cell-accent">êtes</td><td>avez</td><td>allez</td><td class="cell-accent">faites</td></tr>
            <tr><th>ils</th><td class="cell-accent">sont</td><td class="cell-accent">ont</td><td class="cell-accent">vont</td><td class="cell-accent">font</td></tr>
          </tbody>
        </table>
      </div>

      <div class="g-card">
        <h3 class="g-heading">Regular Present Endings</h3>
        <table class="g-table">
          <thead>
            <tr><th></th><th>-er (parler)</th><th>-ir (finir)</th><th>-re (vendre)</th></tr>
          </thead>
          <tbody>
            <tr><th>je</th><td><b>-e</b></td><td><b>-is</b></td><td><b>-s</b></td></tr>
            <tr><th>tu</th><td><b>-es</b></td><td><b>-is</b></td><td><b>-s</b></td></tr>
            <tr><th>il / on</th><td><b>-e</b></td><td><b>-it</b></td><td><b>—</b></td></tr>
            <tr><th>nous</th><td><b>-ons</b></td><td class="cell-accent"><b>-issons</b></td><td><b>-ons</b></td></tr>
            <tr><th>vous</th><td><b>-ez</b></td><td class="cell-accent"><b>-issez</b></td><td><b>-ez</b></td></tr>
            <tr><th>ils</th><td><b>-ent</b></td><td class="cell-accent"><b>-issent</b></td><td><b>-ent</b></td></tr>
          </tbody>
        </table>
      </div>
    `
  },
  {
    title: 'Past & Future Tenses',
    html: `
      <div class="g-card g-compact-list">
        <h3 class="g-heading">Passé Composé vs. Imparfait</h3>
        <div><b>Passé composé</b> <i>(completed event)</i> — <b>avoir / être</b> + participle (<i>-é, -i, -u</i>)</div>
        <div><b>Takes être</b> <i>(agrees in -e/-s)</i> — All <b>se</b> verbs + <i>aller/venir, arriver/partir, entrer/sortir, monter/descendre, naître/mourir, rester, tomber, retourner</i></div>
        <div><b>Imparfait</b> <i>(habit / ongoing / setting)</i> — <i>nous</i>-stem + <b>-ais, -ais, -ait, -ions, -iez, -aient</b> <span class="g-sub">(être → ét-)</span></div>
      </div>

      <div class="g-card g-compact-list">
        <h3 class="g-heading">Future &amp; Conditional</h3>
        <div><b>Near future</b> — <b>aller</b> + infinitive (<i>Je vais partir</i>)</div>
        <div><b>Futur simple</b> — infinitive + <b>-ai, -as, -a, -ons, -ez, -ont</b></div>
        <div><b>Conditionnel</b> — future stem + <b>-ais, -ais, -ait, -ions, -iez, -aient</b></div>
        <div class="g-divider"></div>
        <div class="g-muted-line"><b>Irregular stems:</b> être → <b>ser-</b> · avoir → <b>aur-</b> · aller → <b>ir-</b> · faire → <b>fer-</b> · pouvoir → <b>pourr-</b> · vouloir → <b>voudr-</b> · voir → <b>verr-</b></div>
      </div>
    `
  },
  {
    title: 'Adjectives & Time',
    html: `
      <div class="g-card g-compact-list">
        <h3 class="g-heading">Adjective Agreement &amp; Position</h3>
        <div><b>Agreement</b> — Fem <b>+e</b>, Pl <b>+s</b> · <i>-eux → -euse · -if → -ive · -el → -elle · beau/bel → belle · nouveau → nouvelle · vieux → vieille</i></div>
        <div><b>Position</b> — Usually <b>after</b> the noun (<i>un chat noir</i>); common short <b>BANGS</b> adjectives go <b>before</b> (<i>beau, joli, jeune, vieux, nouveau, bon, mauvais, petit, grand</i>).</div>
      </div>

      <div class="g-card g-compact-list">
        <h3 class="g-heading">Negation</h3>
        <div class="g-chips">
          <span><b>ne … pas</b> not</span>
          <span><b>ne … plus</b> no longer</span>
          <span><b>ne … jamais</b> never</span>
          <span><b>ne … rien</b> nothing</span>
          <span><b>ne … personne</b> nobody</span>
        </div>
        <div class="g-muted-line">Wraps conjugated verb (<i>Je <b>ne</b> sais <b>pas</b></i>); spoken French often drops <i>ne</i>.</div>
      </div>

      <div class="g-card g-compact-list">
        <h3 class="g-heading">Time Prepositions</h3>
        <div><b>depuis</b> — since / for <i>(still ongoing → use <b>present</b> tense!)</i></div>
        <div><b>pendant</b> — for <i>(completed duration)</i> · <b>pour</b> — for <i>(planned future)</i></div>
        <div><b>il y a</b> — ago (<i>il y a 2 ans</i>) · <b>dans</b> — in <i>(future: dans 5 min)</i></div>
      </div>
    `
  }
];

export const GRAMMAR_BY_LANG = {
  de: GERMAN_PAGES,
  fr: FRENCH_PAGES
};

export const GRAMMAR_PAGES = GERMAN_PAGES;
