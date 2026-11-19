# Podrobni opisi primerov uporabe

Številke primerov uporabe se ujemajo s tabelo pod [diagramom v README.md](README.md#diagram-primerov-uporabe). Opisani so vsi primeri uporabe, ki še niso implementirani (PU5 do PU17). PU1 do PU4 so že implementirani.

| ID | Primer uporabe | Akter |
|---|---|---|
| [PU5](#pu5-nalaganje-slikovne-datoteke) | Nalaganje slikovne datoteke | Uporabnik |
| [PU6](#pu6-razvrščanje-slik) | Razvrščanje slik | Uporabnik |
| [PU7](#pu7-ustvarjanje-albuma) | Ustvarjanje albuma | Uporabnik |
| [PU8](#pu8-pregled-osebnih-albumov) | Pregled osebnih albumov | Uporabnik |
| [PU9](#pu9-iskanje-osebnega-albuma) | Iskanje osebnega albuma | Uporabnik |
| [PU10](#pu10-objava-albuma) | Objava albuma | Uporabnik |
| [PU11](#pu11-gledanje-albumov-ostalih-uporabnikov-feed) | Gledanje albumov ostalih uporabnikov (feed) | Uporabnik |
| [PU12](#pu12-iskanje-albuma) | Iskanje albuma | Uporabnik |
| [PU13](#pu13-ogled-albuma) | Ogled albuma | Uporabnik |
| [PU14](#pu14-ogled-profila) | Ogled profila | Uporabnik |
| [PU15](#pu15-urejanje-osebnih-podatkov) | Urejanje osebnih podatkov | Uporabnik |
| [PU16](#pu16-urejanje-uporabniških-profilov) | Urejanje uporabniških profilov | Administrator |
| [PU17](#pu17-urejanje-albumov) | Urejanje albumov | Administrator |

---

## PU5: Nalaganje slikovne datoteke

<table>
<tr><td><b>Primer uporabe:</b> Nalaganje slikovne datoteke</td><td><b>ID:</b> PU5</td></tr>
<tr><td colspan="2"><b>Cilj:</b> Uporabnik pri dodajanju slike (PU3) naloži slikovno datoteko, da je slika v galeriji res vidna in ne le zapis o njej.</td></tr>
<tr><td colspan="2"><b>Akterji:</b> Uporabnik</td></tr>
<tr><td colspan="2"><b>Predpogoji:</b> Uporabnik izvaja dodajanje slike (PU3), ki ta primer uporabe vključuje. Datoteka je v podprtem formatu (jpg, png, gif) in ne presega največje dovoljene velikosti (npr. 10 MB).</td></tr>
<tr><td colspan="2"><b>Stanje sistema po PU:</b> Datoteka je shranjena na strežniku. Zapis slike ima izpolnjena tip in velikost iz datoteke ter povezavo do nje. Slika je vidna v pregledu osebnih slik (PU1).</td></tr>
<tr><td colspan="2"><b>Scenarij:</b><br><br>
1. Uporabnik v obrazcu za dodajanje slike izbere možnost »Izberi datoteko«.<br>
2. Uporabnik izbere datoteko na svoji napravi.<br>
3. Sistem prikaže predogled slike.<br>
4. Sistem iz datoteke samodejno izpolni tip in velikost.<br>
5. Uporabnik potrdi dodajanje.<br>
6. Sistem preveri tip in velikost datoteke.<br>
7. Sistem shrani datoteko in zapis o sliki.<br>
8. Sistem prikaže potrdilo in sliko v seznamu.</td></tr>
<tr><td colspan="2"><b>Alternativni tokovi:</b><br><br>
2a. Uporabnik prekliče izbiro: obrazec ostane nespremenjen, dodajanje ni mogoče potrditi brez datoteke.<br>
6a. Tip datoteke ni podprt: sistem prikaže sporočilo s seznamom podprtih tipov in se vrne na korak 2.<br>
6b. Datoteka je prevelika: sistem prikaže sporočilo z največjo velikostjo in se vrne na korak 2.</td></tr>
<tr><td colspan="2"><b>Izjeme:</b><br><br>
Shranjevanje datoteke ne uspe (npr. poln disk): v bazo se ne zapiše nič, sistem prikaže sporočilo o napaki.<br>
Zapis v bazo ne uspe po shranitvi datoteke: sistem datoteko izbriše, da ne ostane brez zapisa, in prikaže sporočilo o napaki.<br>
Povezava se prekine med nalaganjem: nalaganje se zavrne, nič se ne shrani, uporabnik poskusi znova.</td></tr>
</table>

---

## PU6: Razvrščanje slik

<table>
<tr><td><b>Primer uporabe:</b> Razvrščanje slik</td><td><b>ID:</b> PU6</td></tr>
<tr><td colspan="2"><b>Cilj:</b> Uporabnik razvrsti prikazane slike po izbranem atributu (ime, tip, velikost, čas dodajanja), da hitreje najde želeno sliko.</td></tr>
<tr><td colspan="2"><b>Akterji:</b> Uporabnik</td></tr>
<tr><td colspan="2"><b>Predpogoji:</b> Uporabnik pregleduje osebne slike (PU1), ki ga ta primer uporabe razširja. V sistemu je vsaj ena slika.</td></tr>
<tr><td colspan="2"><b>Stanje sistema po PU:</b> Seznam je prikazan v izbranem vrstnem redu. Podatki v bazi se ne spremenijo. Izbrani vrstni red velja tudi pri iskanju (PU2) in listanju po straneh.</td></tr>
<tr><td colspan="2"><b>Scenarij:</b><br><br>
1. Uporabnik klikne na glavo stolpca (npr. »Name«).<br>
2. Sistem zahteva podatke, razvrščene naraščajoče po izbranem atributu.<br>
3. Sistem prikaže prvo stran razvrščenega seznama in označi stolpec s puščico.<br>
4. Uporabnik ponovno klikne na isti stolpec.<br>
5. Sistem obrne vrstni red (padajoče) in prikaže prvo stran.</td></tr>
<tr><td colspan="2"><b>Alternativni tokovi:</b><br><br>
1a. Uporabnik klikne na drug stolpec: sistem razvrsti po novem stolpcu, naraščajoče.<br>
3a. Seznam je bil prej filtriran z iskanjem (PU2): razvrščanje se uporabi na zadetkih.<br>
5a. Uporabnik klikne tretjič: sistem odstrani razvrščanje in se vrne na privzeti vrstni red (po id).</td></tr>
<tr><td colspan="2"><b>Izjeme:</b><br><br>
Seznam je prazen: sistem prikaže sporočilo »Ni zadetkov«, razvrščanje nima učinka.<br>
Strežnik zavrne neznan atribut razvrščanja: sistem uporabi privzeti vrstni red.<br>
Strežnik ni dosegljiv: sistem prikaže sporočilo o napaki, prejšnji prikaz ostane.</td></tr>
</table>

---

## PU7: Ustvarjanje albuma

<table>
<tr><td><b>Primer uporabe:</b> Ustvarjanje albuma</td><td><b>ID:</b> PU7</td></tr>
<tr><td colspan="2"><b>Cilj:</b> Uporabnik združi svoje slike v poimenovan album (npr. dogodek ali generacija).</td></tr>
<tr><td colspan="2"><b>Akterji:</b> Uporabnik</td></tr>
<tr><td colspan="2"><b>Predpogoji:</b> Uporabnik je prijavljen. Za album z vsebino mora imeti vsaj eno osebno sliko (sicer se ustvari prazen album).</td></tr>
<tr><td colspan="2"><b>Stanje sistema po PU:</b> V bazi je nov zaseben album z izbranimi slikami. Album je viden v pregledu osebnih albumov (PU8), drugim uporabnikom pa šele po objavi (PU10).</td></tr>
<tr><td colspan="2"><b>Scenarij:</b><br><br>
1. Uporabnik izbere možnost »Nov album«.<br>
2. Sistem prikaže obrazec (ime, opis).<br>
3. Uporabnik vnese podatke.<br>
4. Uporabnik med svojimi slikami izbere slike za album.<br>
5. Uporabnik potrdi ustvarjanje.<br>
6. Sistem preveri podatke (ime je obvezno in enolično med albumi uporabnika).<br>
7. Sistem ustvari album in doda izbrane slike.<br>
8. Sistem prikaže ustvarjeni album.</td></tr>
<tr><td colspan="2"><b>Alternativni tokovi:</b><br><br>
3a. Uporabnik prekliče ustvarjanje: nič se ne shrani.<br>
4a. Uporabnik ne izbere nobene slike: ustvari se prazen album, slike lahko doda pozneje.<br>
6a. Ime je prazno ali že obstaja: sistem prikaže sporočilo in se vrne na korak 3.</td></tr>
<tr><td colspan="2"><b>Izjeme:</b><br><br>
Izbrana slika je bila med ustvarjanjem izbrisana: sistem jo preskoči, album ustvari in uporabnika o tem obvesti.<br>
Baza ni dosegljiva: sistem prikaže sporočilo o napaki, album ni ustvarjen.</td></tr>
</table>

---

## PU8: Pregled osebnih albumov

<table>
<tr><td><b>Primer uporabe:</b> Pregled osebnih albumov</td><td><b>ID:</b> PU8</td></tr>
<tr><td colspan="2"><b>Cilj:</b> Uporabnik pregleda seznam svojih albumov (zasebnih in objavljenih) in izbere album za nadaljnja dejanja.</td></tr>
<tr><td colspan="2"><b>Akterji:</b> Uporabnik</td></tr>
<tr><td colspan="2"><b>Predpogoji:</b> Uporabnik je prijavljen.</td></tr>
<tr><td colspan="2"><b>Stanje sistema po PU:</b> Prikazan je seznam albumov prijavljenega uporabnika z naslovno sliko, imenom, številom slik in stanjem (»Zasebno« ali »Javno«). Podatki v bazi se ne spremenijo.</td></tr>
<tr><td colspan="2"><b>Scenarij:</b><br><br>
1. Uporabnik v meniju izbere »Moji albumi«.<br>
2. Sistem pridobi albume prijavljenega uporabnika, razvrščene od najnovejšega.<br>
3. Sistem prikaže prvo stran seznama (naslovna slika, ime, število slik, stanje).<br>
4. Uporabnik po potrebi lista po straneh.<br>
5. Uporabnik izbere album.<br>
6. Sistem prikaže vsebino albuma s slikami in možnostmi, ki so na voljo lastniku (npr. »Objavi«).</td></tr>
<tr><td colspan="2"><b>Alternativni tokovi:</b><br><br>
2a. Uporabnik še nima albumov: sistem prikaže sporočilo »Še nimate albumov« in gumb »Nov album«, ki začne ustvarjanje albuma (PU7).<br>
4a. Uporabnik vpiše iskalni niz: nadaljuje se iskanje osebnega albuma (PU9).<br>
6a. Uporabnik izbere »Objavi«: nadaljuje se objava albuma (PU10).</td></tr>
<tr><td colspan="2"><b>Izjeme:</b><br><br>
Seja je potekla: sistem uporabnika preusmeri na prijavo in ga po prijavi vrne na seznam.<br>
Izbrani album je bil vmes izbrisan (npr. administrator, PU17): sistem prikaže sporočilo in osveži seznam.<br>
Strežnik ni dosegljiv: sistem prikaže sporočilo o napaki in gumb »Poskusi znova«.</td></tr>
</table>

---

## PU9: Iskanje osebnega albuma

<table>
<tr><td><b>Primer uporabe:</b> Iskanje osebnega albuma</td><td><b>ID:</b> PU9</td></tr>
<tr><td colspan="2"><b>Cilj:</b> Uporabnik med svojimi albumi hitro najde album po imenu ali opisu.</td></tr>
<tr><td colspan="2"><b>Akterji:</b> Uporabnik</td></tr>
<tr><td colspan="2"><b>Predpogoji:</b> Uporabnik pregleduje osebne albume (PU8), ki ga ta primer uporabe razširja.</td></tr>
<tr><td colspan="2"><b>Stanje sistema po PU:</b> Seznam prikazuje samo albume uporabnika, ki ustrezajo iskalnemu nizu. Podatki v bazi se ne spremenijo.</td></tr>
<tr><td colspan="2"><b>Scenarij:</b><br><br>
1. Uporabnik vpiše iskalni niz v polje za iskanje nad seznamom albumov.<br>
2. Sistem počaka kratek čas po zadnjem pritisku tipke (npr. 300 ms).<br>
3. Sistem med albumi prijavljenega uporabnika poišče tiste, katerih ime ali opis vsebuje niz (brez razlikovanja velikih in malih črk).<br>
4. Sistem prikaže prvo stran zadetkov.<br>
5. Uporabnik izbere album in nadaljuje kot v PU8 (korak 6).</td></tr>
<tr><td colspan="2"><b>Alternativni tokovi:</b><br><br>
1a. Uporabnik izbriše iskalni niz: sistem znova prikaže vse albume (PU8).<br>
4a. Ni zadetkov: sistem prikaže sporočilo »Ni zadetkov«, iskalni niz ostane v polju.<br>
4b. Zadetkov je več kot za eno stran: uporabnik lista po straneh, iskalni niz ostane upoštevan.</td></tr>
<tr><td colspan="2"><b>Izjeme:</b><br><br>
Iskalni niz je daljši od 100 znakov: sistem ne dovoli vnosa daljšega niza.<br>
Strežnik ni dosegljiv: sistem prikaže sporočilo o napaki, prejšnji seznam ostane prikazan.</td></tr>
</table>

---

## PU10: Objava albuma

<table>
<tr><td><b>Primer uporabe:</b> Objava albuma</td><td><b>ID:</b> PU10</td></tr>
<tr><td colspan="2"><b>Cilj:</b> Uporabnik objavi svoj album, da postane viden ostalim uporabnikom v feedu (PU11) in pri iskanju albumov (PU12).</td></tr>
<tr><td colspan="2"><b>Akterji:</b> Uporabnik (lastnik albuma)</td></tr>
<tr><td colspan="2"><b>Predpogoji:</b> Uporabnik je prijavljen in pregleduje osebne albume (PU8), ki ga ta primer uporabe razširja. Album obstaja, pripada uporabniku in še ni objavljen.</td></tr>
<tr><td colspan="2"><b>Stanje sistema po PU:</b> Album je označen kot javen in ima zabeležen čas objave. Prikazuje se v feedu in pri iskanju albumov ostalih uporabnikov.</td></tr>
<tr><td colspan="2"><b>Scenarij:</b><br><br>
1. Uporabnik v pregledu osebnih albumov izbere album.<br>
2. Uporabnik izbere »Objavi«.<br>
3. Sistem prikaže potrditveno okno z opozorilom, da bo album viden vsem uporabnikom.<br>
4. Uporabnik potrdi objavo.<br>
5. Sistem preveri, da je uporabnik lastnik albuma in da album ni prazen.<br>
6. Sistem označi album kot javen in zapiše čas objave.<br>
7. Sistem prikaže potrdilo in pri albumu oznako »Javno«.</td></tr>
<tr><td colspan="2"><b>Alternativni tokovi:</b><br><br>
2a. Album je že objavljen: namesto »Objavi« sistem ponudi »Umakni objavo«; po potrditvi album spet postane zaseben in izgine iz feeda.<br>
4a. Uporabnik prekliče objavo: album ostane zaseben.<br>
5a. Album je prazen: sistem prikaže sporočilo, da mora album vsebovati vsaj eno sliko, in se vrne na korak 1.</td></tr>
<tr><td colspan="2"><b>Izjeme:</b><br><br>
Uporabnik ni lastnik albuma: sistem zavrne zahtevo (403).<br>
Album je bil vmes izbrisan: sistem prikaže sporočilo in osveži seznam albumov.<br>
Baza ni dosegljiva: sistem prikaže sporočilo o napaki, album ostane zaseben.</td></tr>
</table>

---

## PU11: Gledanje albumov ostalih uporabnikov (feed)

<table>
<tr><td><b>Primer uporabe:</b> Gledanje albumov ostalih uporabnikov (feed)</td><td><b>ID:</b> PU11</td></tr>
<tr><td colspan="2"><b>Cilj:</b> Uporabnik pregleduje nedavno objavljene albume drugih alumnov in tako spremlja dogajanje v skupnosti.</td></tr>
<tr><td colspan="2"><b>Akterji:</b> Uporabnik</td></tr>
<tr><td colspan="2"><b>Predpogoji:</b> Uporabnik je prijavljen.</td></tr>
<tr><td colspan="2"><b>Stanje sistema po PU:</b> Prikazani so objavljeni albumi drugih uporabnikov, razvrščeni po času objave od najnovejšega. Podatki v bazi se ne spremenijo.</td></tr>
<tr><td colspan="2"><b>Scenarij:</b><br><br>
1. Uporabnik odpre »Feed« (začetna stran po prijavi).<br>
2. Sistem pridobi objavljene albume drugih uporabnikov; lastnih albumov in albumov blokiranih uporabnikov ne vključi.<br>
3. Sistem prikaže prvo skupino albumov (naslovna slika, ime albuma, avtor, čas objave, število slik).<br>
4. Uporabnik se pomakne do konca seznama.<br>
5. Sistem naloži in doda naslednjo skupino albumov.<br>
6. Uporabnik izbere album in nadaljuje z ogledom albuma (PU13).</td></tr>
<tr><td colspan="2"><b>Alternativni tokovi:</b><br><br>
2a. Ni objavljenih albumov drugih uporabnikov: sistem prikaže sporočilo »Ni še objavljenih albumov«.<br>
5a. Ni več albumov za nalaganje: sistem na koncu seznama prikaže »Ni več albumov«.<br>
6a. Uporabnik klikne ime avtorja: sistem prikaže profil avtorja (PU14).</td></tr>
<tr><td colspan="2"><b>Izjeme:</b><br><br>
Avtor je album medtem umaknil iz objave ali ga je odstranil administrator: ob izbiri sistem prikaže sporočilo »Album ni več na voljo« in ga odstrani iz feeda.<br>
Strežnik ni dosegljiv: sistem prikaže sporočilo o napaki in gumb »Poskusi znova«; že naloženi albumi ostanejo prikazani.</td></tr>
</table>

---

## PU12: Iskanje albuma

<table>
<tr><td><b>Primer uporabe:</b> Iskanje albuma</td><td><b>ID:</b> PU12</td></tr>
<tr><td colspan="2"><b>Cilj:</b> Uporabnik med vsemi objavljenimi albumi poišče album po imenu, opisu ali imenu avtorja (npr. »Generacija 2020«).</td></tr>
<tr><td colspan="2"><b>Akterji:</b> Uporabnik</td></tr>
<tr><td colspan="2"><b>Predpogoji:</b> Uporabnik je prijavljen.</td></tr>
<tr><td colspan="2"><b>Stanje sistema po PU:</b> Prikazani so objavljeni albumi, ki ustrezajo iskalnemu nizu. Zasebni albumi drugih uporabnikov se med zadetki nikoli ne pojavijo. Podatki v bazi se ne spremenijo.</td></tr>
<tr><td colspan="2"><b>Scenarij:</b><br><br>
1. Uporabnik izbere »Iskanje albumov«.<br>
2. Uporabnik vpiše iskalni niz.<br>
3. Uporabnik potrdi iskanje (tipka Enter ali gumb »Išči«).<br>
4. Sistem preveri, da ima niz vsaj 2 znaka.<br>
5. Sistem med objavljenimi albumi poišče tiste, katerih ime, opis ali ime avtorja vsebuje niz (brez razlikovanja velikih in malih črk).<br>
6. Sistem prikaže prvo stran zadetkov (naslovna slika, ime albuma, avtor).<br>
7. Uporabnik izbere album in nadaljuje z ogledom albuma (PU13).</td></tr>
<tr><td colspan="2"><b>Alternativni tokovi:</b><br><br>
4a. Niz je krajši od 2 znakov: sistem prikaže sporočilo in se vrne na korak 2.<br>
6a. Ni zadetkov: sistem prikaže sporočilo »Ni zadetkov« in predlaga drug iskalni niz.<br>
6b. Zadetkov je več kot za eno stran: uporabnik lista po straneh.</td></tr>
<tr><td colspan="2"><b>Izjeme:</b><br><br>
Album iz zadetkov je bil medtem umaknjen iz objave: ob izbiri sistem prikaže sporočilo »Album ni več na voljo« in osveži zadetke.<br>
Strežnik ni dosegljiv: sistem prikaže sporočilo o napaki, iskalni niz ostane v polju.</td></tr>
</table>

---

## PU13: Ogled albuma

<table>
<tr><td><b>Primer uporabe:</b> Ogled albuma</td><td><b>ID:</b> PU13</td></tr>
<tr><td colspan="2"><b>Cilj:</b> Uporabnik si ogleda slike v objavljenem albumu drugega uporabnika.</td></tr>
<tr><td colspan="2"><b>Akterji:</b> Uporabnik</td></tr>
<tr><td colspan="2"><b>Predpogoji:</b> Uporabnik je album izbral v feedu (PU11) ali med zadetki iskanja (PU12); oba ta primera uporabe PU13 razširja. Album je objavljen.</td></tr>
<tr><td colspan="2"><b>Stanje sistema po PU:</b> Prikazane so podrobnosti in slike albuma. Podatki v bazi se ne spremenijo.</td></tr>
<tr><td colspan="2"><b>Scenarij:</b><br><br>
1. Uporabnik izbere album.<br>
2. Sistem preveri, da je album objavljen.<br>
3. Sistem prikaže glavo albuma (ime, opis, avtor, čas objave) in mrežo slik.<br>
4. Uporabnik izbere sliko.<br>
5. Sistem prikaže sliko v polni velikosti skupaj z njenim imenom.<br>
6. Uporabnik se s puščicama premika med slikami albuma.<br>
7. Uporabnik zapre prikaz in se vrne na seznam, s katerega je prišel (feed ali zadetki iskanja).</td></tr>
<tr><td colspan="2"><b>Alternativni tokovi:</b><br><br>
3a. Album nima slik (npr. avtor jih je vmes izbrisal): sistem prikaže sporočilo »Album je prazen«.<br>
3b. Uporabnik klikne ime avtorja: sistem prikaže profil avtorja (PU14).<br>
6a. Uporabnik je na zadnji sliki in klikne naprej: sistem prikaže prvo sliko albuma.</td></tr>
<tr><td colspan="2"><b>Izjeme:</b><br><br>
Album je bil umaknjen iz objave ali izbrisan: sistem prikaže sporočilo »Album ni več na voljo« in uporabnika vrne na prejšnji seznam.<br>
Uporabnik prek neposredne povezave odpre zaseben album drugega uporabnika: sistem zavrne dostop in prikaže »Album ni na voljo« (ne razkrije, da album obstaja).<br>
Slika se ne naloži: sistem namesto nje prikaže nadomestno ikono, ostale slike ostanejo vidne.</td></tr>
</table>

---

## PU14: Ogled profila

<table>
<tr><td><b>Primer uporabe:</b> Ogled profila</td><td><b>ID:</b> PU14</td></tr>
<tr><td colspan="2"><b>Cilj:</b> Uporabnik si ogleda svoj profil ali profil drugega alumna in njegove objavljene albume.</td></tr>
<tr><td colspan="2"><b>Akterji:</b> Uporabnik</td></tr>
<tr><td colspan="2"><b>Predpogoji:</b> Uporabnik je prijavljen. Profil obstaja.</td></tr>
<tr><td colspan="2"><b>Stanje sistema po PU:</b> Prikazan je profil. Podatki v bazi se ne spremenijo.</td></tr>
<tr><td colspan="2"><b>Scenarij:</b><br><br>
1. Uporabnik izbere »Moj profil« ali klikne ime avtorja albuma.<br>
2. Sistem pridobi podatke profila.<br>
3. Sistem prikaže javne podatke (ime, opis, profilna slika) in seznam objavljenih albumov tega uporabnika.<br>
4. Če gre za lastni profil, sistem prikaže še zasebne podatke (e-pošta) in gumb »Uredi«.</td></tr>
<tr><td colspan="2"><b>Alternativni tokovi:</b><br><br>
3a. Uporabnik nima objavljenih albumov: sistem namesto seznama prikaže »Ni objavljenih albumov«.<br>
3b. Uporabnik izbere album s seznama: nadaljuje se ogled albuma (PU13).<br>
4a. Uporabnik na lastnem profilu izbere »Uredi«: nadaljuje se urejanje osebnih podatkov (PU15).</td></tr>
<tr><td colspan="2"><b>Izjeme:</b><br><br>
Profil ne obstaja ali je račun blokiran: sistem prikaže sporočilo »Profil ni na voljo«.<br>
Strežnik ni dosegljiv: sistem prikaže sporočilo o napaki in gumb »Poskusi znova«.</td></tr>
</table>

---

## PU15: Urejanje osebnih podatkov

<table>
<tr><td><b>Primer uporabe:</b> Urejanje osebnih podatkov</td><td><b>ID:</b> PU15</td></tr>
<tr><td colspan="2"><b>Cilj:</b> Uporabnik posodobi svoje osebne podatke, da ga drugi alumni lažje prepoznajo.</td></tr>
<tr><td colspan="2"><b>Akterji:</b> Uporabnik</td></tr>
<tr><td colspan="2"><b>Predpogoji:</b> Uporabnik si ogleduje svoj profil (PU14), ki ga ta primer uporabe razširja.</td></tr>
<tr><td colspan="2"><b>Stanje sistema po PU:</b> Novi podatki so shranjeni in vidni na profilu ter pri albumih uporabnika.</td></tr>
<tr><td colspan="2"><b>Scenarij:</b><br><br>
1. Uporabnik na svojem profilu izbere »Uredi«.<br>
2. Sistem prikaže obrazec z obstoječimi podatki (ime, e-pošta, opis, profilna slika).<br>
3. Uporabnik spremeni podatke.<br>
4. Uporabnik potrdi spremembe.<br>
5. Sistem preveri podatke: ime ni prazno, e-pošta je veljavna in enolična, opis ima največ 500 znakov, profilna slika je jpg ali png do 2 MB.<br>
6. Sistem shrani spremembe.<br>
7. Sistem prikaže posodobljen profil in potrdilo.</td></tr>
<tr><td colspan="2"><b>Alternativni tokovi:</b><br><br>
3a. Uporabnik prekliče urejanje: podatki ostanejo nespremenjeni, sistem prikaže profil.<br>
3b. Uporabnik spremeni e-pošto: sistem na novi naslov pošlje potrditveno sporočilo; nova e-pošta velja šele po potrditvi, ostale spremembe se shranijo takoj.<br>
5a. Podatki niso veljavni: sistem pri napačnih poljih prikaže sporočila, ohrani vnesene podatke in se vrne na korak 3.</td></tr>
<tr><td colspan="2"><b>Izjeme:</b><br><br>
Administrator je medtem spremenil isti profil (PU16): sistem zazna sočasno spremembo, prikaže sveže podatke in zahteva ponovno potrditev.<br>
Račun je bil med urejanjem blokiran: sistem spremembe zavrne in uporabnika odjavi.<br>
Baza ni dosegljiva: sistem prikaže sporočilo o napaki, vneseni podatki ostanejo v obrazcu.</td></tr>
</table>

---

## PU16: Urejanje uporabniških profilov

<table>
<tr><td><b>Primer uporabe:</b> Urejanje uporabniških profilov</td><td><b>ID:</b> PU16</td></tr>
<tr><td colspan="2"><b>Cilj:</b> Administrator uredi podatke ali stanje uporabniškega profila (npr. popravi neprimerno ime ali blokira račun) in tako skrbi za red v skupnosti.</td></tr>
<tr><td colspan="2"><b>Akterji:</b> Administrator</td></tr>
<tr><td colspan="2"><b>Predpogoji:</b> Administrator je prijavljen in ima vlogo administratorja. Profil, ki ga ureja, obstaja.</td></tr>
<tr><td colspan="2"><b>Stanje sistema po PU:</b> Spremembe profila so shranjene, zabeležena sta administrator in čas spremembe. Blokiran uporabnik se ne more prijaviti, njegovi objavljeni albumi pa niso več vidni v feedu.</td></tr>
<tr><td colspan="2"><b>Scenarij:</b><br><br>
1. Administrator odpre seznam uporabnikov.<br>
2. Sistem prikaže seznam uporabnikov (z iskanjem in listanjem po straneh).<br>
3. Administrator izbere uporabnika.<br>
4. Sistem prikaže obrazec profila (ime, e-pošta, opis, vloga, stanje računa).<br>
5. Administrator spremeni podatke.<br>
6. Administrator potrdi spremembe.<br>
7. Sistem preveri podatke (ime ni prazno, e-pošta je veljavna in enolična).<br>
8. Sistem shrani spremembe in zapiše dogodek v dnevnik.<br>
9. Sistem prikaže posodobljen profil.</td></tr>
<tr><td colspan="2"><b>Alternativni tokovi:</b><br><br>
5a. Administrator blokira račun: sistem zahteva razlog blokade in nadaljuje s korakom 6.<br>
5b. Administrator želi odvzeti vlogo administratorja zadnjemu administratorju v sistemu: sistem spremembo zavrne in prikaže sporočilo.<br>
6a. Administrator prekliče urejanje: profil ostane nespremenjen.<br>
7a. Podatki niso veljavni: sistem prikaže sporočilo in se vrne na korak 5.</td></tr>
<tr><td colspan="2"><b>Izjeme:</b><br><br>
Uporabnik nima vloge administratorja: sistem zavrne dostop (403).<br>
Uporabnik je medtem sam spremenil svoje podatke (PU15): sistem zazna sočasno spremembo, prikaže sveže podatke in zahteva ponovno potrditev.<br>
Profil je bil vmes izbrisan: sistem prikaže sporočilo in osveži seznam.<br>
Baza ni dosegljiva: sistem prikaže sporočilo o napaki, profil ostane nespremenjen.</td></tr>
</table>

---

## PU17: Urejanje albumov

<table>
<tr><td><b>Primer uporabe:</b> Urejanje albumov</td><td><b>ID:</b> PU17</td></tr>
<tr><td colspan="2"><b>Cilj:</b> Administrator uredi ali odstrani album kateregakoli uporabnika (npr. neprimerno ime ali neprimerne slike) in tako ohranja primerno vsebino v skupnosti.</td></tr>
<tr><td colspan="2"><b>Akterji:</b> Administrator. Uporabnik (lastnik albuma) je o spremembi obveščen.</td></tr>
<tr><td colspan="2"><b>Predpogoji:</b> Administrator je prijavljen in ima vlogo administratorja. Album obstaja.</td></tr>
<tr><td colspan="2"><b>Stanje sistema po PU:</b> Spremembe albuma so shranjene. Zabeleženi so administrator, čas in razlog. Lastnik je obveščen. Album, ki je bil umaknjen iz objave ali izbrisan, ni več viden v feedu (PU11) in pri iskanju albumov (PU12).</td></tr>
<tr><td colspan="2"><b>Scenarij:</b><br><br>
1. Administrator odpre seznam vseh albumov.<br>
2. Sistem prikaže albume vseh uporabnikov z iskanjem po imenu albuma ali lastnika in listanjem po straneh.<br>
3. Administrator izbere album.<br>
4. Sistem prikaže podatke albuma (ime, opis, stanje, lastnik) in njegove slike.<br>
5. Administrator spremeni ime ali opis, odstrani posamezne slike iz albuma ali umakne objavo.<br>
6. Administrator vnese razlog spremembe.<br>
7. Administrator potrdi spremembe.<br>
8. Sistem preveri podatke (razlog ni prazen, ime ni prazno in je enolično med albumi lastnika).<br>
9. Sistem shrani spremembe in zapiše dogodek v dnevnik.<br>
10. Sistem obvesti lastnika albuma.<br>
11. Sistem prikaže posodobljen album.</td></tr>
<tr><td colspan="2"><b>Alternativni tokovi:</b><br><br>
5a. Administrator izbere »Izbriši album«: sistem zahteva potrditev in razlog, album izbriše, slike pa ostanejo med osebnimi slikami lastnika; nadaljuje se s korakom 9.<br>
7a. Administrator prekliče urejanje: album ostane nespremenjen.<br>
8a. Podatki niso veljavni: sistem prikaže sporočilo in se vrne na korak 5.</td></tr>
<tr><td colspan="2"><b>Izjeme:</b><br><br>
Uporabnik nima vloge administratorja: sistem zavrne dostop (403).<br>
Lastnik je album medtem spremenil ali izbrisal: sistem prikaže sporočilo in osveži podatke.<br>
Obveščanje lastnika ne uspe: sprememba kljub temu velja, napaka se zabeleži.<br>
Baza ni dosegljiva: sistem prikaže sporočilo o napaki, album ostane nespremenjen.</td></tr>
</table>
