'use strict';
const PRON=['yo','tú','él/ella/usted','nosotros','vosotros','ellos/ellas/ustedes'];
const END={ar:['o','as','a','amos','áis','an'],er:['o','es','e','emos','éis','en'],ir:['o','es','e','imos','ís','en']};
const reg=i=>{const s=i.slice(0,-2),t=i.slice(-2);return END[t].map(e=>s+e)};
const V=(i,de,f)=>({i,de,f:f||reg(i)});
const LESSONS=[
{id:'a1-01',lv:'A1',title:'Aussprache, Alphabet und Betonung',goals:['Ich kenne die wichtigsten Laute des Spanischen.','Ich kann die Betonungsregel anwenden.'],
html:`<p>Spanisch wird weitgehend so gesprochen, wie es geschrieben wird. Jeder Buchstabe hat einen festen Laut.</p>
<table><tr><th>Schrift</th><th>Aussprache</th><th>Beispiel</th></tr>
<tr><td>h</td><td>stumm</td><td>hola [ola]</td></tr><tr><td>j / g vor e,i</td><td>hartes „ch“ wie in „Bach“</td><td>jamón, gente</td></tr>
<tr><td>ll / y</td><td>wie deutsches „j“</td><td>llamar, yo</td></tr><tr><td>ñ</td><td>„nj“</td><td>año</td></tr>
<tr><td>c vor e,i / z</td><td>gelispeltes „th“ (Spanien) oder „s“ (Lateinamerika)</td><td>cena, zapato</td></tr>
<tr><td>qu / c vor a,o,u</td><td>„k“</td><td>queso, casa</td></tr><tr><td>b / v</td><td>gleicher Laut</td><td>vaca, baca</td></tr>
<tr><td>rr / r am Wortanfang</td><td>gerolltes r</td><td>perro, rojo</td></tr></table>
<h2>Betonung</h2><p>Endet ein Wort auf Vokal, <b>n</b> oder <b>s</b>, wird die vorletzte Silbe betont (<i>hablo, casas</i>). Endet es auf einen anderen Konsonanten, wird die letzte Silbe betont (<i>hablar, ciudad</i>). Weicht ein Wort davon ab, steht ein Akzent: <i>café, canción, teléfono</i>.</p>
<div class="tip"><b>Typischer Fehler:</b> Deutsche sprechen v wie „w“ oder „f“ und h wie in „Haus“. Im Spanischen ist h stumm.</div>
<p>Tipp: Tippe unten auf 🔊, um die Wörter zu hören (Browser-Sprachausgabe).</p>`,
mc:[['Wie wird „hola“ gesprochen?',['ola','hola mit hartem h','chola'],0,'h ist im Spanischen stumm.'],
['Wo liegt die Betonung bei „casas“?',['ca-SAS','CA-sas'],1,'Endung auf s: vorletzte Silbe.'],
['Wo liegt die Betonung bei „hablar“?',['HA-blar','ha-BLAR'],1,'Endung auf Konsonant (nicht n/s): letzte Silbe.'],
['Wie klingt „ñ“?',['wie n','wie „nj“','wie „ng“'],1,'ñ klingt wie „nj“ in „Anja“.'],
['Warum hat „canción“ einen Akzent?',['Endet auf n, wird aber auf der letzten Silbe betont','Er ist nur Zierde'],0,'Abweichung von der Grundregel wird mit Akzent markiert.'],
['Wie klingt „j“ in „jamón“?',['wie deutsches j','hartes ch wie in „Bach“','wie sch'],1,'j = hartes „ch“.'],
['Welcher Laut ist bei b und v gleich?',['ja','nein'],0,'b und v werden gleich gesprochen.']],
listen:['hola','buenos días','gracias','mañana','ciudad','canción']},
{id:'a1-02',lv:'A1',title:'Regelmäßige Verben auf -ar (Presente)',goals:['Ich kann -ar-Verben in allen sechs Personen konjugieren.','Ich bilde Sätze, Fragen und Verneinungen.'],
verbs:[V('hablar','sprechen'),V('trabajar','arbeiten'),V('estudiar','lernen/studieren'),V('cantar','singen'),V('bailar','tanzen'),V('comprar','kaufen'),V('escuchar','hören'),V('mirar','anschauen'),V('viajar','reisen'),V('cocinar','kochen')],
rule:'Regel: Stamm (Infinitiv ohne -ar) + -o, -as, -a, -amos, -áis, -an.',
sent:[['Yo hablo español.','Ich spreche Spanisch.'],['¿Trabajas en Berlín?','Arbeitest du in Berlin?'],['Nosotros no cantamos.','Wir singen nicht.'],['Ella compra pan.','Sie kauft Brot.'],['Vosotros estudiáis mucho.','Ihr lernt viel.']],
html:`<p>Verben auf <b>-ar</b> bilden das Presente regelmäßig: Man entfernt <b>-ar</b> und hängt die Endung der jeweiligen Person an. Das Personalpronomen wird meist weggelassen, weil die Endung die Person zeigt.</p>
<table><tr><th>Person</th><th>hablar</th><th>Endung</th></tr><tr><td>yo</td><td>hablo</td><td>-o</td></tr><tr><td>tú</td><td>hablas</td><td>-as</td></tr><tr><td>él/ella/usted</td><td>habla</td><td>-a</td></tr><tr><td>nosotros</td><td>hablamos</td><td>-amos</td></tr><tr><td>vosotros</td><td>habláis</td><td>-áis</td></tr><tr><td>ellos/ellas/ustedes</td><td>hablan</td><td>-an</td></tr></table>
<h2>Beispiele</h2><p>Hablo alemán. (Ich spreche Deutsch.) · ¿Hablas inglés? (Sprichst du Englisch?) · Ana trabaja hoy. (Ana arbeitet heute.) · No bailamos. (Wir tanzen nicht.) · ¿Cantáis? (Singt ihr?) · Ellos compran fruta. (Sie kaufen Obst.)</p>
<p><b>Verneinung:</b> no vor das Verb. <b>Fragen:</b> ¿ … ? – die Wortstellung bleibt, die Stimme geht hoch.</p>
<div class="tip"><b>Typischer Fehler:</b> Den Infinitiv statt der konjugierten Form nutzen („yo hablar“) oder den Akzent in <i>habláis</i> vergessen.</div>`},
{id:'a1-03',lv:'A1',title:'Regelmäßige Verben auf -er und -ir (Presente)',goals:['Ich konjugiere -er- und -ir-Verben.','Ich erkenne, wo sich -er und -ir unterscheiden.'],
verbs:[V('comer','essen'),V('beber','trinken'),V('aprender','lernen'),V('leer','lesen'),V('vender','verkaufen'),V('vivir','wohnen/leben'),V('escribir','schreiben'),V('abrir','öffnen'),V('subir','hinaufgehen'),V('recibir','erhalten')],
rule:'Regel: -er: -o, -es, -e, -emos, -éis, -en · -ir: -o, -es, -e, -imos, -ís, -en. Nur nosotros und vosotros unterscheiden sich.',
sent:[['Yo como pan.','Ich esse Brot.'],['¿Vives en Madrid?','Wohnst du in Madrid?'],['Ellos beben agua.','Sie trinken Wasser.'],['Nosotros escribimos cartas.','Wir schreiben Briefe.'],['Ella lee un libro.','Sie liest ein Buch.']],
html:`<p>Die Endungen von <b>-er</b> und <b>-ir</b> sind fast gleich. Nur bei <i>nosotros</i> (-emos / -imos) und <i>vosotros</i> (-éis / -ís) gibt es einen Unterschied.</p>
<table><tr><th>Person</th><th>comer</th><th>vivir</th></tr><tr><td>yo</td><td>como</td><td>vivo</td></tr><tr><td>tú</td><td>comes</td><td>vives</td></tr><tr><td>él/ella</td><td>come</td><td>vive</td></tr><tr><td>nosotros</td><td>comemos</td><td>vivimos</td></tr><tr><td>vosotros</td><td>coméis</td><td>vivís</td></tr><tr><td>ellos</td><td>comen</td><td>viven</td></tr></table>
<p>Beispiele: Como fruta. (Ich esse Obst.) · ¿Bebes café? (Trinkst du Kaffee?) · Vivimos en Hamburgo. (Wir wohnen in Hamburg.) · Escribo un correo. (Ich schreibe eine E-Mail.)</p>
<div class="tip"><b>Typischer Fehler:</b> „vivimos“ mit „comimos“ verwechseln: Bei -er heißt es <i>comemos</i>.</div>`},
{id:'a1-04',lv:'A1',title:'Ser, estar, tener und ir',goals:['Ich kenne die Formen der vier wichtigsten Verben.','Ich unterscheide ser und estar.'],
verbs:[V('ser','sein (Wesen, Herkunft)',['soy','eres','es','somos','sois','son']),V('estar','sein (Ort, Zustand)',['estoy','estás','está','estamos','estáis','están']),V('tener','haben',['tengo','tienes','tiene','tenemos','tenéis','tienen']),V('ir','gehen',['voy','vas','va','vamos','vais','van'])],
rule:'Diese Verben sind unregelmäßig und müssen auswendig gelernt werden.',
sent:[['Soy alemán.','Ich bin Deutscher.'],['Estoy en casa.','Ich bin zu Hause.'],['Tengo dos hermanos.','Ich habe zwei Geschwister.'],['Vamos al cine.','Wir gehen ins Kino.'],['¿Cómo estás?','Wie geht es dir?']],
html:`<table><tr><th></th><th>ser</th><th>estar</th><th>tener</th><th>ir</th></tr><tr><td>yo</td><td>soy</td><td>estoy</td><td>tengo</td><td>voy</td></tr><tr><td>tú</td><td>eres</td><td>estás</td><td>tienes</td><td>vas</td></tr><tr><td>él/ella</td><td>es</td><td>está</td><td>tiene</td><td>va</td></tr><tr><td>nosotros</td><td>somos</td><td>estamos</td><td>tenemos</td><td>vamos</td></tr><tr><td>vosotros</td><td>sois</td><td>estáis</td><td>tenéis</td><td>vais</td></tr><tr><td>ellos</td><td>son</td><td>están</td><td>tienen</td><td>van</td></tr></table>
<p><b>ser</b> für Identität, Beruf, Herkunft, Eigenschaften (<i>Soy profesor. Es alta.</i>). <b>estar</b> für Ort und Zustand (<i>Estoy cansado. Madrid está en España.</i>). <b>ir a</b> + Infinitiv drückt die nahe Zukunft aus: <i>Voy a comer.</i> (Ich werde essen.)</p>
<div class="tip"><b>Typischer Fehler:</b> „Yo soy cansado“ – richtig: <i>Estoy cansado</i> (vorübergehender Zustand).</div>`}];
const VOCAB=[
['hola','hallo','','¡Hola, ¿qué tal?','Begrüßung'],['adiós','tschüss','','Adiós, hasta mañana.','Begrüßung'],['gracias','danke','','Muchas gracias.','Begrüßung'],['por favor','bitte','','Un café, por favor.','Begrüßung'],['buenos días','guten Morgen','','Buenos días, señora.','Begrüßung'],['buenas noches','gute Nacht','','Buenas noches a todos.','Begrüßung'],
['la madre','die Mutter','f','Mi madre trabaja mucho.','Familie'],['el padre','der Vater','m','Mi padre cocina bien.','Familie'],['el hermano','der Bruder','m','Tengo un hermano.','Familie'],['la hermana','die Schwester','f','Mi hermana vive en Sevilla.','Familie'],['el hijo','der Sohn','m','Su hijo estudia.','Familie'],['la familia','die Familie','f','Mi familia es grande.','Familie'],
['el pan','das Brot','m','Compro pan.','Essen'],['el agua','das Wasser','f','Bebo agua.','Essen'],['la manzana','der Apfel','f','La manzana es roja.','Essen'],['el queso','der Käse','m','Me gusta el queso.','Essen'],['el café','der Kaffee','m','Un café con leche.','Essen'],['la leche','die Milch','f','La leche está fría.','Essen'],
['la casa','das Haus','f','Mi casa es pequeña.','Wohnen'],['la cocina','die Küche','f','La cocina es moderna.','Wohnen'],['la mesa','der Tisch','f','La mesa es de madera.','Wohnen'],['la ventana','das Fenster','f','Abro la ventana.','Wohnen'],['el dormitorio','das Schlafzimmer','m','El dormitorio es tranquilo.','Wohnen'],
['uno','eins','','Tengo uno.','Zahlen'],['dos','zwei','','Dos cafés, por favor.','Zahlen'],['tres','drei','','Somos tres.','Zahlen'],['cinco','fünf','','Son las cinco.','Zahlen'],['diez','zehn','','Tengo diez euros.','Zahlen'],
['lunes','Montag','m','El lunes trabajo.','Zeit'],['martes','Dienstag','m','El martes estudio.','Zeit'],['hoy','heute','','Hoy estoy en casa.','Zeit'],['mañana','morgen / Morgen','','Mañana viajo.','Zeit']].map((v,i)=>({id:'v'+i,es:v[0],de:v[1],g:v[2],ex:v[3],t:v[4]}));
