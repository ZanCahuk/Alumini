
# Uporabniške zgodbe (User Stories)

## US-01 – Ustvarjanje in urejanje albumov

- **ID:** US-01
- **Odgovorni član:** Žan
- **Vloga:** Registriran uporabnik

### Uporabniška zgodba

Kot registriran uporabnik želim ustvarjati albume in vanje dodajati ter urejati slike, da lahko svoje slike organiziram in jih prilagodim po svojih željah.

---

## Sprejemni kriteriji (Acceptance Criteria)

### AC-01: Ustvarjanje albuma

- **Given:** Uporabnik je prijavljen v sistem.
- **When:** Uporabnik izbere možnost za ustvarjanje albuma in vnese njegovo ime.
- **Then:** Sistem ustvari nov album z izbranim imenom in ga prikaže na seznamu albumov.

### AC-02: Neveljavno ime albuma

- **Given:** Uporabnik je na obrazcu za ustvarjanje albuma.
- **When:** Uporabnik poskuša ustvariti album brez imena.
- **Then:** Sistem albuma ne ustvari in uporabniku prikaže obvestilo, da mora vnesti ime.

### AC-03: Dodajanje slik v album

- **Given:** Uporabnik ima ustvarjen album.
- **When:** Uporabnik izbere eno ali več slik za dodajanje v album.
- **Then:** Sistem doda izbrane slike v album in jih prikaže v njegovem delovnem prostoru.

### AC-04: Premikanje slik

- **Given:** Uporabnik ima odprt album, ki vsebuje vsaj eno sliko.
- **When:** Uporabnik premakne sliko na drugo mesto v albumu.
- **Then:** Slika se prikaže na novi izbrani lokaciji.

### AC-05: Spreminjanje velikosti slik

- **Given:** Uporabnik ima odprt album z vsaj eno sliko.
- **When:** Uporabnik spremeni velikost izbrane slike.
- **Then:** Sistem prikaže sliko v novi velikosti, ne da bi spremenil njeno vsebino.

### AC-06: Shranjevanje sprememb

- **Given:** Uporabnik je v albumu premaknil ali spremenil velikost ene ali več slik.
- **When:** Uporabnik shrani spremembe in ponovno odpre album.
- **Then:** Sistem prikaže slike na zadnjih shranjenih lokacijah in v zadnjih shranjenih velikostih.

---

## Podrobnosti implementacije

### Ustvarjanje albumov

- Uporabnik bo lahko ustvaril nov album z vnosom imena.
- Vsak album bo imel svoje ime in seznam slik.
- Ustvarjeni albumi bodo prikazani v seznamu albumov.

### Dodajanje slik

- Uporabnik bo lahko v album dodal eno ali več slik.
- Slike bodo prikazane v delovnem prostoru albuma.
- Vsaka slika bo predstavljena kot samostojen element, ki ga je mogoče urejati.

### Urejanje slik

- Slike bo mogoče premikati po delovnem prostoru z uporabo funkcije drag-and-drop.
- Velikost slik bo mogoče spreminjati z vlečenjem robov oziroma vogalov slike.
- Pri spreminjanju velikosti se bo ohranilo razmerje stranic slike.
- Slike se bodo lahko med seboj prekrivale.

### Shranjevanje

- Položaj in velikost vsake slike se bosta shranila.
- Ob ponovnem odprtju albuma se bo obnovila zadnja shranjena postavitev.

---

#### (Sub-issues)

### TASK-01 – Ustvarjanje albumov

**Odgovorni član:** Žan

- Implementacija ustvarjanja novega albuma.
- Vnos in preverjanje imena albuma.
- Prikaz ustvarjenih albumov.

### TASK-02 – Dodajanje slik v albume

**Odgovorni član:** Žan

- Omogočiti izbiro in dodajanje slik.
- Prikaz slik v delovnem prostoru albuma.
- Povezovanje slik z ustreznim albumom.

### TASK-03 – Premikanje in spreminjanje velikosti slik

**Odgovorni član:** Žan

- Implementacija premikanja slik z drag-and-drop.
- Omogočiti spreminjanje velikosti slik.
- Ohraniti razmerje stranic pri spreminjanju velikosti.

### TASK-04 – Shranjevanje postavitve albuma

**Odgovorni član:** Žan

- Shranjevanje položaja in velikosti slik.
- Obnovitev postavitve ob ponovnem odprtju albuma.


# US-02


## Uporabniška zgodba

Kot uporabnik želim na domači strani videti svoje naložene slike in z njimi upravljati (naložiti novo, urediti ime, izbrisati), da imam vse svoje slike na enem mestu in jih lahko uporabim v albumih.

## Sprejemni kriteriji

### AC-01: Prikaz slik

- **Given:** V sistemu je naloženih 8 slik.
- **When:** Uporabnik odpre domačo stran.
- **Then:** Sistem prikaže 6 slik v obliki kartic z miniaturo, imenom, velikostjo in tipom, pod seznamom pa strani 1 in 2 za pregledovanje.

### AC-02: Iskanje slik

- **Given:** Uporabnik je na domači strani in v sistemu so slike z različnimi imeni.
- **When:** Uporabnik v iskalno polje vpiše del imena ali tipa slike.
- **Then:** Sistem prikaže samo slike, katerih ime ali tip vsebuje vpisani niz, neodvisno od velikosti črk.

### AC-03: Ni zadetkov

- **Given:** Uporabnik je na domači strani.
- **When:** Uporabnik vpiše niz, ki ga ne vsebuje nobena slika, ali v sistemu ni nobene slike.
- **Then:** Sistem prikaže sporočilo »Ni najdenih slik« namesto seznama.

### AC-04: Strežnik ni dosegljiv

- **Given:** Strežnik ni dosegljiv.
- **When:** Uporabnik odpre domačo stran.
- **Then:** Sistem prikaže sporočilo »Slik ni bilo mogoče naložiti« in ne prikaže praznega seznama brez pojasnila.

## Podrobnosti implementacije

### Prikaz slik

- Domača stran (`/` in `/slike`) prikaže slike v mreži kartic v enakem slogu kot seznam albumov (isti CSS razredi iz `Albumi.css`).
- Naslovnica kartice je slika, ki jo vrne `GET /slike/prejmi/{id}`.
- Klik na kartico odpre sliko v povečavi, meni s tremi pikami ponuja Odpri, Uredi in Izbriši.

### Iskanje in paginacija

- `GET /slike/iskanje?q=&page=&size=` vrne stran zadetkov, velikost strani je 6.
- Iskanje poteka po polju `name` ali `type` brez upoštevanja velikosti črk (`SlikeDao.findByNameContainingIgnoreCaseOrTypeContainingIgnoreCase`).

### Podatkovni model

- Entiteta `Slike`: `id`, `name`, `type`, `size`, `datumNalaganja`, `podatkiSlike`.
- Polje `podatkiSlike` je `byte[]` (v PostgreSQL `bytea`) z `@JsonIgnore`, zato se ne vrača v seznamih.
- Podatki se hranijo v PostgreSQL v Dockerju.

## Naloge

- TASK-01: Nalaganje slike
- TASK-02: Urejanje slike
- TASK-03: Brisanje slike


| Polje | Vrednost |
|---|---|
| ID | US-02 |
| Odgovorni član | Žiga |
| Vloga | Uporabnik |
