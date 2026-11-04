# Alumini

Spletna aplikacija za upravljanje zbirke slik (dodajanje, urejanje, brisanje, iskanje in paginacija zapisov).

## Kazalo

1. [O projektu](#o-projektu)
2. [Uporabljene tehnologije](#uporabljene-tehnologije)
3. [Struktura projekta](#struktura-projekta)
4. [Navodila za nameščanje in zagon](#navodila-za-nameščanje-in-zagon)
5. [Navodila za razvijalce](#navodila-za-razvijalce)
6. [Standardi kodiranja](#standardi-kodiranja)

---

## O projektu

Alumini je celovita (full-stack) aplikacija, sestavljena iz React odjemalca (frontend) in Spring Boot strežnika (backend) s PostgreSQL bazo.

**Cilji projekta:**

- upravljanje zapisov o slikah (ime, tip, velikost),
- polni CRUD (ustvarjanje, branje, urejanje, brisanje),
- iskanje po imenu ali tipu in strežniška paginacija (5 zapisov na stran),
- jasna ločitev med odjemalcem, REST API-jem in bazo.

**Funkcionalnosti:**

| Funkcionalnost | Opis |
|---|---|
| Pregled slik | Tabela vseh zapisov z akcijami Uredi in Izbriši |
| Dodajanje | Obrazec na poti `/slike/dodaj` |
| Urejanje | Obrazec na poti `/slike/uredi/:id` |
| Brisanje | Potrditveno okno in osvežitev seznama |
| Iskanje | Iskanje po imenu ali tipu (brez razlikovanja velikih in malih črk) |
| Paginacija | Strani se izračunajo v bazi (`LIMIT` / `OFFSET`) |

---

## Uporabljene tehnologije

### Backend

| Tehnologija | Različica |
|---|---|
| Java (JDK) | 25 |
| Spring Boot | 4.1.1 |
| Spring Web MVC | prek Spring Boot 4.1.1 |
| Spring Data JPA (Hibernate 7.4.5) | prek Spring Boot 4.1.1 |
| Spring Validation | prek Spring Boot 4.1.1 |
| springdoc-openapi (Swagger UI) | 3.1.0 |
| Lombok | 1.18.46 |
| PostgreSQL JDBC gonilnik | 42.7.13 |
| Maven (Maven Wrapper) | 3.x (prenese ga `mvnw`) |

### Frontend

Različice so povzete iz `package.json`.

| Tehnologija | Različica |
|---|---|
| Node.js | LTS v24.14.0 |
| React / React DOM | ^19.3.1 |
| react-router | ^7.18.4 |
| Material UI (`@mui/material`) | ^9.5.0 |
| Material UI ikone (`@mui/icons-material`) | ^9.5.0 |
| Emotion (`@emotion/react`, `@emotion/styled`) | ^11.14.0, ^11.14.1 |
| axios | ^1.20.0 |
| Create React App (`react-scripts`) | 5.0.1 |
| cross-env (razvojna odvisnost) | ^10.1.0 |
| Testna orodja (`@testing-library/*`) | react ^16.3.3, jest-dom ^6.9.1, dom ^10.4.2, user-event ^13.5.0 |

### Infrastruktura in orodja

| Orodje | Namen |
|---|---|
| PostgreSQL 17 | podatkovna baza (v Docker vsebniku) |
| Docker / Docker Compose | zagon baze |
| DataGrip (neobvezno) | pregled baze |
| Postman (neobvezno) | testiranje API-ja |
| Git / GitHub | verzioniranje |

---

## Struktura projekta

> Imena map prilagodite dejanskemu stanju v repozitoriju.

```
Alumini/
├── Backend/                          # Spring Boot aplikacija
│   ├── pom.xml                       # Maven odvisnosti in nastavitve prevajanja
│   ├── mvnw, mvnw.cmd                # Maven Wrapper
│   └── src/
│       └── main/
│           ├── java/com/example/alumini/
│           │   ├── AluminiApplication.java   # vstopna točka
│           │   ├── rest/                     # REST kontrolerji (SlikeController, HelloController)
│           │   ├── dao/                      # repozitoriji (SlikeDao)
│           │   └── vao/                      # entitete (Slike)
│           └── resources/
│               └── application.properties    # nastavitve strežnika in baze
├── Frontend/
│   └── alumini/                      # React aplikacija
│       ├── package.json              # odvisnosti in skripte
│       ├── .env.example              # primer okoljskih spremenljivk
│       ├── public/
│       └── src/
│           ├── App.js                # BrowserRouter + usmerjanje
│           ├── services/
│           │   └── api.js            # axios instanca (baseURL)
│           └── components/
│               ├── Routing/          # definicija poti
│               ├── Slike/            # Slike, SlikeTable, DodajSliko, UrediSliko
│               └── PageNotFound/     # stran 404
├── docker-compose.yml                # PostgreSQL vsebnik
├── .gitignore
└── README.md
```

### Razlaga map

| Mapa | Vsebina |
|---|---|
| `Backend/.../rest` | REST kontrolerji, ki sprejemajo HTTP zahteve |
| `Backend/.../dao` | Spring Data repozitoriji za dostop do baze |
| `Backend/.../vao` | JPA entitete (preslikava tabel) |
| `Backend/.../resources` | konfiguracija aplikacije |
| `Frontend/.../services` | komunikacija z backendom |
| `Frontend/.../components/Slike` | zasloni in tabela za upravljanje slik |
| `Frontend/.../components/Routing` | poti aplikacije |

### REST API

Osnovni naslov: `http://localhost:8080`

| Metoda | Pot | Opis |
|---|---|---|
| GET | `/slike` | vsi zapisi |
| GET | `/slike/iskanje?q=&page=&size=` | iskanje + paginacija |
| GET | `/slike/{id}` | en zapis |
| POST | `/slike` | nov zapis |
| POST | `/slike/bulk` | več zapisov naenkrat |
| PUT | `/slike/{id}` | urejanje zapisa |
| DELETE | `/slike/{id}` | brisanje zapisa |
| DELETE | `/slike` | brisanje vseh zapisov |

Swagger UI: `http://localhost:8080/swagger-ui.html`

---

## Navodila za nameščanje in zagon

### Predpogoji

| Orodje | Zahteva | Preverjanje |
|---|---|---|
| JDK | **25** (ne 26 ali 27; Lombok ju še ne podpira) | `java -version` |
| Node.js + npm | LTS | `node -v`, `npm -v` |
| Docker Desktop | zagnan (Engine running) | `docker version` |
| Git | katera koli novejša | `git --version` |

Maven ni treba nameščati, ker projekt vsebuje Maven Wrapper (`mvnw`).

### 1. Kloniranje

```bash
git clone https://github.com/ZanCahuk/Alumini.git
cd Alumini
```

### 2. Zagon baze (PostgreSQL v Dockerju)

V korenski mapi (kjer je `docker-compose.yml`):

```bash
docker compose up -d
docker ps
```

Vsebnik `alumini-db` mora imeti status `Up`. Baza `alumini` se ustvari samodejno, tabele pa ustvari Hibernate ob prvem zagonu backenda.

Ustavitev baze: `docker compose stop`. Podatki ostanejo v Docker volumnu. Ukaza `docker compose down -v` ne uporabljajte, če želite podatke obdržati.

### 3. Zagon backenda

V mapi s `pom.xml`:

```powershell
# Windows (PowerShell)
.\mvnw.cmd spring-boot:run
```

```bash
# Linux / macOS
./mvnw spring-boot:run
```

Backend teče na `http://localhost:8080`. V dnevniku poiščite `Started AluminiApplication`.

**Nastavitve (`src/main/resources/application.properties`):**

```properties
server.port=8080
spring.application.name=Alumini

spring.datasource.url=jdbc:postgresql://localhost:5432/alumini
spring.datasource.username=alumini
spring.datasource.password=root

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Uporabnik, geslo in ime baze se morajo ujemati z `docker-compose.yml`. Podane vrednosti so samo za lokalni razvoj.

### 4. Zagon frontenda

V mapi s `package.json`:

```bash
npm install
```

Ustvarite datoteko `.env` (je v `.gitignore`, zato je ni v repozitoriju). Primer je v `.env.example`:

```
REACT_APP_BASE_URL=http://localhost:8080
```

Nato:

```bash
npm start
```

Aplikacija se odpre na `http://localhost:3000`. Po vsaki spremembi `.env` je treba `npm start` ponovno zagnati.

Skripta `npm start` privzeto odpre **Firefox** (`cross-env BROWSER=firefox`). Če Firefoxa nimate, v `package.json` zamenjajte `firefox` z drugim brskalnikom ali z `none` (brskalnik se ne odpre samodejno).

### Okoljske spremenljivke

| Spremenljivka | Kje | Pomen | Primer |
|---|---|---|---|
| `REACT_APP_BASE_URL` | Frontend `.env` | naslov backenda | `http://localhost:8080` |
| `spring.datasource.*` | `application.properties` | povezava z bazo | glej zgoraj |
| `JAVA_HOME` | sistem | pot do JDK 25 | `C:\Program Files\Eclipse Adoptium\jdk-25...` |

### Pogoste težave

| Težava | Rešitev |
|---|---|
| `ExceptionInInitializerError` / `Could not initialize class lombok.javac.Javac` | uporabljate napačen JDK; nastavite JDK 25 |
| `cannot find symbol ... setId` pri `mvnw` | preverite `annotationProcessorPaths` za Lombok v `pom.xml` |
| `Port 8080 was already in use` | ustavite drug proces ali spremenite `server.port` |
| `password authentication failed` | geslo v `application.properties` ni enako geslu v `docker-compose.yml` |
| `Unable to determine Dialect` | baza ne teče ali povezava ni pravilna |
| 404 v Reactu na `/slike` | manjka `.env` z `REACT_APP_BASE_URL` |
| `Module not found: axios` | zaženite `npm install` |

---

## Navodila za razvijalce

### Potek dela z Gitom

1. Najprej posodobite glavno vejo:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Ustvarite novo vejo za vsako funkcionalnost ali popravek:
   ```bash
   git checkout -b feature/ime-funkcionalnosti
   ```
3. Delajte v majhnih korakih in pogosto potrjujte (commit):
   ```bash
   git add .
   git commit -m "feat: kratek opis spremembe"
   ```
4. Objavite vejo:
   ```bash
   git push -u origin feature/ime-funkcionalnosti
   ```
5. Na GitHubu odprite **Pull Request** proti veji `main`, opišite spremembo in počakajte na pregled.
6. Po odobritvi združite (merge) Pull Request in izbrišite vejo.

### Poimenovanje vej

| Predpona | Uporaba | Primer |
|---|---|---|
| `feature/` | nova funkcionalnost | `feature/iskanje` |
| `fix/` | popravek napake | `fix/brisanje-zadnje-strani` |
| `docs/` | dokumentacija | `docs/readme` |
| `refactor/` | preoblikovanje kode | `refactor/slike-controller` |

### Sporočila commitov

Oblika: `tip: kratek opis v ukazni obliki`

| Tip | Pomen |
|---|---|
| `feat` | nova funkcionalnost |
| `fix` | popravek napake |
| `docs` | dokumentacija |
| `refactor` | preoblikovanje brez spremembe delovanja |
| `chore` | vzdrževalna opravila (odvisnosti, konfiguracija) |

### Pravila

- Neposredno v `main` ne potrjujemo sprememb, uporabimo Pull Request.
- V repozitorij ne dodajamo `node_modules/`, `target/`, `.env` ali skrivnosti.
- Pred objavo preverite, ali se backend in frontend zaženeta.

---

## Standardi kodiranja

### Java (backend)

- Razredi: `PascalCase` (`SlikeController`), metode in spremenljivke: `camelCase`, konstante: `UPPER_SNAKE_CASE`.
- Paketi so v malih črkah: `rest`, `dao`, `vao`.
- Kontrolerji vsebujejo samo obravnavo HTTP zahtev, dostop do baze gre prek repozitorijev (`dao`).
- Za entitete uporabljamo Lombok (`@Data`); za JPA entitete poskrbimo za konstruktor brez argumentov.
- Za manjkajoče zapise vračamo ustrezne HTTP kode (`404`) prek `ResponseStatusException`.
- Pot, parametri in `@PathVariable` morajo imeti enaka imena (npr. `/slike/{id}` in `@PathVariable("id")`).
- Zamik: 4 presledki.

### JavaScript / React (frontend)

- Komponente: `PascalCase`, datoteka ima isto ime kot komponenta (`SlikeTable.js`).
- Spremenljivke in funkcije: `camelCase`.
- Samo funkcijske komponente in React Hooks (`useState`, `useEffect`).
- Vsi klici na backend gredo prek skupne `api` instance v `services/api.js`, nikoli prek golega `axios` z vpisanim naslovom.
- Naslov backenda je v okoljski spremenljivki, ne v kodi.
- Vse uvoze za usmerjanje uvažamo iz enega paketa (`react-router`).
- Zamik: 2 ali 4 presledki (v celotnem projektu enako), podpičja dosledno.

### Splošno

- Kratke, jasne funkcije z eno nalogo.
- Imena naj opisujejo namen (`izbrisiSliko`, ne `fn1`).
- Komentarji pojasnjujejo *zakaj*, ne *kaj*.
- Nobenih gesel ali ključev v kodi, ki ni namenjena samo lokalnemu razvoju.

---

## Avtor

Žan Čahuk, FERI, predmet RIS.