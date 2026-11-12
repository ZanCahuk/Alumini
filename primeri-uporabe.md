# Podrobni opisi primerov uporabe

Opisi veljajo za primere uporabe iz [diagrama v README.md](../README.md#diagram-primerov-uporabe), ki še niso implementirani: **PU6 do PU10**. PU1 do PU5 (pregled, iskanje, dodajanje, urejanje in brisanje zapisov) so že implementirani.

| ID | Primer uporabe |
|---|---|
| [PU6](#pu6-nalaganje-slikovne-datoteke) | Nalaganje slikovne datoteke |
| [PU7](#pu7-razvrščanje-slik) | Razvrščanje slik |
| [PU8](#pu8-ustvarjanje-albuma) | Ustvarjanje albuma |
| [PU9](#pu9-komentiranje-slike) | Komentiranje slike |
| [PU10](#pu10-moderiranje-vsebine) | Moderiranje vsebine |

---

## PU6: Nalaganje slikovne datoteke

<table>
<tr><td><b>Primer uporabe:</b> Nalaganje slikovne datoteke</td><td><b>ID:</b> PU6</td></tr>
<tr><td colspan="2"><b>Cilj:</b> Uporabnik pri dodajanju slike (PU3) naloži slikovno datoteko, da je slika v galeriji res vidna in ne le zapis o njej.</td></tr>
<tr><td colspan="2"><b>Akterji:</b> Uporabnik</td></tr>
<tr><td colspan="2"><b>Predpogoji:</b> Uporabnik izvaja dodajanje slike (PU3). Datoteka je v podprtem formatu (jpg, png, gif) in ne presega največje dovoljene velikosti (npr. 10 MB).</td></tr>
<tr><td colspan="2"><b>Stanje sistema po PU:</b> Datoteka je shranjena na strežniku. Zapis slike ima izpolnjena tip in velikost iz datoteke ter povezavo do nje. Slika je vidna v pregledu.</td></tr>
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
2a. Uporabnik ne izbere datoteke: sistem omogoči dodajanje zapisa brez datoteke (trenutno delovanje).<br>
2b. Uporabnik prekliče izbiro: obrazec ostane nespremenjen.<br>
6a. Tip datoteke ni podprt: sistem prikaže sporočilo s seznamom podprtih tipov in se vrne na korak 2.<br>
6b. Datoteka je prevelika: sistem prikaže sporočilo z največjo velikostjo in se vrne na korak 2.</td></tr>
<tr><td colspan="2"><b>Izjeme:</b><br><br>
Shranjevanje datoteke ne uspe (npr. poln disk): v bazo se ne zapiše nič, sistem prikaže sporočilo o napaki.<br>
Zapis v bazo ne uspe po shranitvi datoteke: sistem datoteko izbriše, da ne ostane brez zapisa, in prikaže sporočilo o napaki.<br>
Povezava se prekine med nalaganjem: nalaganje se zavrne, nič se ne shrani, uporabnik poskusi znova.</td></tr>
</table>

---

## PU7: Razvrščanje slik

<table>
<tr><td><b>Primer uporabe:</b> Razvrščanje slik</td><td><b>ID:</b> PU7</td></tr>
<tr><td colspan="2"><b>Cilj:</b> Uporabnik razvrsti prikazane slike po izbranem atributu (ime, tip, velikost, čas dodajanja), da hitreje najde želeno sliko.</td></tr>
<tr><td colspan="2"><b>Akterji:</b> Uporabnik</td></tr>
<tr><td colspan="2"><b>Predpogoji:</b> Uporabnik pregleduje slike (PU1). V sistemu je vsaj ena slika.</td></tr>
<tr><td colspan="2"><b>Stanje sistema po PU:</b> Seznam je prikazan v izbranem vrstnem redu. Podatki v bazi se ne spremenijo. Izbrani vrstni red velja tudi pri iskanju in listanju po straneh.</td></tr>
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

## PU8: Ustvarjanje albuma

<table>
<tr><td><b>Primer uporabe:</b> Ustvarjanje albuma</td><td><b>ID:</b> PU8</td></tr>
<tr><td colspan="2"><b>Cilj:</b> Uporabnik združi slike v poimenovan album (npr. dogodek ali generacija).</td></tr>
<tr><td colspan="2"><b>Akterji:</b> Uporabnik</td></tr>
<tr><td colspan="2"><b>Predpogoji:</b> V sistemu obstaja vsaj ena slika, ki jo je mogoče dodati v album (sicer se ustvari prazen album).</td></tr>
<tr><td colspan="2"><b>Stanje sistema po PU:</b> V bazi je nov album z izbranimi slikami. Album je viden v pregledu albumov.</td></tr>
<tr><td colspan="2"><b>Scenarij:</b><br><br>
1. Uporabnik izbere možnost »Nov album«.<br>
2. Sistem prikaže obrazec (ime, opis).<br>
3. Uporabnik vnese podatke.<br>
4. Uporabnik med slikami izbere slike za album.<br>
5. Uporabnik potrdi ustvarjanje.<br>
6. Sistem preveri podatke (ime je obvezno in enolično).<br>
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

## PU9: Komentiranje slike

<table>
<tr><td><b>Primer uporabe:</b> Komentiranje slike</td><td><b>ID:</b> PU9</td></tr>
<tr><td colspan="2"><b>Cilj:</b> Uporabnik poda komentar pod sliko.</td></tr>
<tr><td colspan="2"><b>Akterji:</b> Uporabnik</td></tr>
<tr><td colspan="2"><b>Predpogoji:</b> Slika obstaja in je odprta v podrobnem prikazu.</td></tr>
<tr><td colspan="2"><b>Stanje sistema po PU:</b> Komentar je shranjen in viden pod sliko skupaj z imenom avtorja in časom objave.</td></tr>
<tr><td colspan="2"><b>Scenarij:</b><br><br>
1. Uporabnik odpre sliko.<br>
2. Uporabnik vpiše komentar.<br>
3. Uporabnik izbere »Objavi«.<br>
4. Sistem preveri komentar (ni prazen, največ 500 znakov).<br>
5. Sistem shrani komentar.<br>
6. Sistem prikaže komentar pod sliko.</td></tr>
<tr><td colspan="2"><b>Alternativni tokovi:</b><br><br>
3a. Uporabnik zapusti stran, ne da bi objavil: komentar se ne shrani.<br>
4a. Komentar je prazen ali predolg: sistem prikaže sporočilo in ohrani vneseno besedilo.</td></tr>
<tr><td colspan="2"><b>Izjeme:</b><br><br>
Slika je bila med pisanjem izbrisana: sistem komentarja ne shrani in prikaže sporočilo, da slika ne obstaja več.<br>
Baza ni dosegljiva: sistem prikaže sporočilo o napaki, vneseno besedilo ostane v obrazcu.</td></tr>
</table>

---

<!-- ## PU10: Moderiranje vsebine -->
<!-- 
<table>
<tr><td><b>Primer uporabe:</b> Moderiranje vsebine</td><td><b>ID:</b> PU10</td></tr>
<tr><td colspan="2"><b>Cilj:</b> Administrator odstrani neprimerne slike ali komentarje in tako ohranja kakovost skupnosti.</td></tr>
<tr><td colspan="2"><b>Akterji:</b> Administrator. Uporabnik (avtor vsebine) je obveščen o odstranitvi.</td></tr>
<tr><td colspan="2"><b>Predpogoji:</b> Uporabnik ima vlogo administratorja. Obstaja vsebina za pregled.</td></tr>
<tr><td colspan="2"><b>Stanje sistema po PU:</b> Izbrana vsebina je odstranjena (slika z uporabo PU5 Brisanje slike). Zabeleženi so razlog, čas in administrator. Avtor je obveščen.</td></tr>
<tr><td colspan="2"><b>Scenarij:</b><br><br>
1. Administrator odpre stran za moderiranje.<br>
2. Sistem prikaže seznam slik in komentarjev (z iskanjem in listanjem po straneh).<br>
3. Administrator izbere vsebino za pregled.<br>
4. Administrator izbere »Odstrani« in vnese razlog.<br>
5. Administrator potrdi odstranitev.<br>
6. Sistem odstrani vsebino (vključen PU5) in zapiše dogodek v dnevnik moderiranja.<br>
7. Sistem obvesti avtorja vsebine.</td></tr>
<tr><td colspan="2"><b>Alternativni tokovi:</b><br><br>
2a. Ni vsebine za prikaz: sistem prikaže sporočilo »Ni zadetkov«.<br>
4a. Razlog ni vnesen: sistem zahteva razlog in se vrne na korak 4.<br>
5a. Administrator prekliče odstranitev: vsebina ostane nespremenjena.</td></tr>
<tr><td colspan="2"><b>Izjeme:</b><br><br>
Uporabnik nima vloge administratorja: sistem zavrne dostop (403).<br>
Vsebina je bila vmes že odstranjena (drug administrator): sistem prikaže sporočilo in osveži seznam.<br>
Obveščanje avtorja ne uspe: vsebina je kljub temu odstranjena, napaka se zabeleži.<br>
Baza ni dosegljiva: sistem prikaže sporočilo o napaki, vsebina ostane nespremenjena.</td></tr>
</table> -->