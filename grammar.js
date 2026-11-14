// 5-page minimalist German grammar cheat sheet

export const GRAMMAR_PAGES = [
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
        <h3 class="g-heading">Personal & Possessive</h3>
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
