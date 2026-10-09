# Dansk copy til den midlertidige forside

Skrevet af A5. Dette dokument har to dele:
1. En **læsbar del** herunder, med forslag, begrundelse og markering af de linjer, der bygger på fakta fra Sørens brief, som endnu ikke er bekræftet via Google/eksterne kilder.
2. En maskinlæsbar **`## Strings`**-blok til sidst, som bygger (A8) henter tekst fra. De markerede "bekræft"-noter står **kun** her i den læsbare del — selve teksten i Strings-blokken er den rene, offentlige tekst, uden interne noter.

Alt besøgende ser, er på dansk. Tonen er faglig og rolig — ikke sælgende, ingen udråbstegn, ingen datoer, ingen "gratis fragt", ingen konkrete priser.

---

## Meta (titel og beskrivelse)

- `meta.title` er 59 tegn (grænse: 60).
- `meta.description` er 141 tegn (grænse: 155).

Begge er skrevet, så de også giver mening, hvis siden en dag ikke længere er password-beskyttet og dukker op i en Google-søgning (se `research/ux-research.md`, afsnit 4, om at password-siden ikke indekseres, mens den er aktiv).

## Overskrift — tre forslag

**Anbefalet:** `Butik og værksted er åbne. Webshoppen er på vej.`

Begrundelse: den står alene uden at læne sig op ad eyebrow-teksten over den, nævner begge dele af budskabet (åbent nu / webshop kommer), og lover ingen dato.

**Alternativ 1:** `Kom forbi butikken – webshoppen er på vej`
Mere indbydende og handlingsorienteret; lidt mindre tydelig på, at *værkstedet* også er åbent.

**Alternativ 2:** `Webshoppen er på vej. Indtil da: kom forbi, ring eller skriv.`
Lægger mest vægt på webshoppen og peger direkte på handlingerne; god hvis man vil understrege CTA'erne fra starten.

Eyebrow-teksten ("Ny webshop på vej") er en lille, kort label over overskriften — ren Press-stil, versaler kommer fra CSS, så jeg har skrevet den med normal store/små bogstaver.

## Mærker og værksted — bygger på Sørens brief (bekræft før lancering)

`brands.intro` bruger tre faktapåstande fra Sørens egen brief, som endnu ikke er krydstjekket eksternt (fx mod Googles virksomhedsprofil, CVR eller brand-forhandlerlister):
- at Specialized er hovedmærket **(fra Sørens brief – bekræft)**
- at butikken har ekstra styrke inden for landevejscykler og elektroniske gearsystemer **(fra Sørens brief – bekræft)**
- at værkstedet servicerer cykler på tværs af alle mærker, ikke kun dem butikken sælger **(fra Sørens brief – bekræft)**

Disse tre er samlet i én kort sætning i `brands.intro`, så siden ikke lover mere, end vi ved. Hvis nogen af delene viser sig forkerte eller for skarpt formuleret ved Gate 1, er det kun denne ene strengværdi, der skal ændres.

## Manglende e-mail

Da Gate 0-beslutningen var "find e-mailen online", og A2 muligvis ikke finder en, har jeg skrevet `contact.email.missing` som en venlig henvisning til telefonnummeret i stedet for en opdigtet adresse — i tråd med reglen om, at vi aldrig gætter på kontaktoplysninger. Hvis A2 finder en rigtig e-mail, bruger byggeren i stedet den rigtige adresse og springer denne streng over.

## Særlige åbningstider

`hours.notice.special` er en skabelon-sætning, der kun vises, når `data/business.json` indeholder en kommende særlig åbningstid (fx juleaften eller en helligdag). Den er bevidst neutral, så den passer til både "lukket hele dagen" og "ændrede tider" — byggeren indsætter selv `{date}` og `{hours}`.

## Billedtekst (alt-tekst)

`photo.alt` beskriver det midlertidige facadefoto (mørkegrå facade, hvidt "BYMAN" i en rund ramme, "CYKLER" i mindre bogstaver). Når det rigtige foto kommer, skal alt-teksten skrives om, så den passer til det nye billede — denne tekst er kun til det midlertidige foto.

## Footer

`footer.text` er en kort, rolig brandlinje. Den gentager **ikke** adresse og telefon som tekst her — de bør stå i footerens markup som strukturerede felter hentet direkte fra `data/business.json` (for NAP-konsistens, se `research/ux-research.md` afsnit 4), så der kun findes ét sted at rette, hvis adressen ændrer sig.

## Nyhedsbrev

Teksten lover ikke en dato — kun at man får besked, "den dag" webshoppen åbner. Overskriften (`newsletter.heading`) er allerede givet af opgavebeskrivelsen og genbruges ordret.

---

## Strings

```text
meta.title = Byman Cykler – cykelbutik & værksted på Østerbro, København
meta.description = Byman Cykler på Øster Farimagsgade: cykler, rådgivning og værksted. Webshoppen er på vej – se åbningstider, ring eller find vej til butikken.
hero.eyebrow = Ny webshop på vej
hero.headline = Butik og værksted er åbne. Webshoppen er på vej.
hero.headline.alt1 = Kom forbi butikken – webshoppen er på vej
hero.headline.alt2 = Webshoppen er på vej. Indtil da: kom forbi, ring eller skriv.
hero.scroll.pause = Sæt rulleteksten på pause
hero.intro = Vi er i gang med at bygge en ny webshop. Indtil den åbner, er butikken og værkstedet klar til at hjælpe dig med køb, rådgivning og service.
hours.heading = Åbningstider
hours.special.heading = Særlige åbningstider
hours.status.open = Åbent nu · lukker {close}
hours.status.opensLater = Lukket · åbner i dag {open}
hours.status.opensTomorrow = Lukket · åbner i morgen {open}
hours.status.opensOn = Lukket · åbner {day} {open}
hours.status.closedToday = Lukket i dag
hours.notice.special = Bemærk: ændrede åbningstider {date}: {hours}
hours.source = Åbningstider fra Google
hours.closed = Lukket
hours.today = i dag
day.monday = mandag
day.tuesday = tirsdag
day.wednesday = onsdag
day.thursday = torsdag
day.friday = fredag
day.saturday = lørdag
day.sunday = søndag
contact.heading = Kontakt
contact.phone.label = Telefon
contact.email.label = E-mail
contact.email.missing = E-mailen er på vej hertil – ring til os i mellemtiden, så hjælper vi dig med det samme.
address.heading = Find os
cta.call = Ring til os
cta.directions = Find vej
cta.write = Skriv til os
brands.heading = Mærker vi forhandler
brands.intro = Vi er specialister i Specialized og har stor erfaring med landevejscykler og elektroniske gearsystemer. Værkstedet servicerer cykler på tværs af mærker.
brands.more = …og mange flere
newsletter.heading = Få besked, når webshoppen åbner
newsletter.text = Efterlad din e-mail, så skriver vi til dig, den dag webshoppen går i luften.
newsletter.button = Giv mig besked
newsletter.email.label = Din e-mail
footer.text = Byman Cykler – personlig rådgivning, salg og værksted for cykelentusiaster i København.
photo.alt = Mørkegrå butiksfacade med et hvidt BYMAN-logo i en rund ramme og teksten CYKLER i mindre bogstaver under – indgangen til Byman Cykler på Øster Farimagsgade.
```
