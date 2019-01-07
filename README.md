# teyit-org-scrapper-api
A very basic web scraper that converts teyit.org to an API. Deployed on Heroku at https://teyit-scrapper-api.herokuapp.com/all

### What is teyit.org?
> teyit.org is an independent fact-checking organization based in Turkey. At a time when the trust in media is at all-time low, our main aims are to prevent false information from spreading online, help media consumers develop their media literacy skills, and develop methods to promote critical thinking.
Check more at: https://teyit.org/about/

### Usage
The API is up under -> https://teyit-scrapper-api.herokuapp.com/all

- `GET: https://teyit-scrapper-api.herokuapp.com/all` returns all the posts in main page.
    `RESPONSE` : 
```javascript
[
    {
    "thumbnail": "https://teyit.org/wp-content/uploads/2019/01/sabanci-ailesinden-bazi-isimlerin-malta-vatandasligina-gectigi-iddiasi.jpg",
    "title": "Sabancı Ailesi’nden bazı isimlerin Malta vatandaşlığına geçtiği iddiası",
    "url_slug": "sabanci-ailesinden-bazi-isimlerin-malta-vatandasligina-gectigi-iddiasi",
    "author": "Alican Acanerler",
    "link": "https://teyit.org/sabanci-ailesinden-bazi-isimlerin-malta-vatandasligina-gectigi-iddiasi/",
    "date": "07/01/2019-19:00"
    },
    {
    "thumbnail": "https://teyit.org/wp-content/uploads/2019/01/saron-mumya-360x240.jpg",
    "title": "Fotoğrafın İsrail eski Başbakanı Ariel Şaron’un hayatını kaybettikten sonraki halini gösterdiği iddiası",
    "url_slug": "fotografin-israil-eski-basbakani-ariel-saronun-hayatini-kaybettikten-sonraki-halini-gosterdigi-iddiasi",
    "author": "Sinan Silsüpür",
    "link": "https://teyit.org/fotografin-israil-eski-basbakani-ariel-saronun-hayatini-kaybettikten-sonraki-halini-gosterdigi-iddiasi/",
    "date": "07/01/2019-17:02"
    },
    {
    "thumbnail": "https://teyit.org/wp-content/uploads/2019/01/fotografin-oldurulen-arastirma-gorevlisi-ceren-damari-gosterdigi-iddiasi-360x240.png",
    "title": "Fotoğrafın öldürülen araştırma görevlisi Ceren Damar’ı gösterdiği iddiası",
    "url_slug": "fotografin-oldurulen-arastirma-gorevlisi-ceren-damari-gosterdigi-iddiasi",
    "author": "Ali Osman Arabacı",
    "link": "https://teyit.org/fotografin-oldurulen-arastirma-gorevlisi-ceren-damari-gosterdigi-iddiasi/",
    "date": "05/01/2019-15:13"
    }
]
```
- `GET: https://teyit-scrapper-api.herokuapp.com/all?lang=eng` returns all the english content at main page.
`RESPONSE`: 
```javascript
[
    {
    "thumbnail": "https://teyit.org/wp-content/uploads/2019/01/Jamal-Khashoggi-introducing-Taliban-group-to-Reagan-750x300.jpg",
    "title": "The claim that a photo shows Jamal Khashoggi introducing Taliban group to Reagan",
    "url_slug": "the-claim-that-a-photo-shows-jamal-khashoggi-introducing-taliban-group-to-reagan",
    "author": "Ali Osman Arabacı",
    "link": "https://teyit.org/en/the-claim-that-a-photo-shows-jamal-khashoggi-introducing-taliban-group-to-reagan/",
    "date": "02/01/2019-17:18"
    },
    {
    "thumbnail": "https://teyit.org/wp-content/uploads/2018/12/sahte-habere-neden-inaniyoruz-video--378x300.png",
    "title": "Why we believe fake news [English subtitle]",
    "url_slug": "why-we-believe-fake-news-english-subtitle",
    "author": "",
    "link": "https://teyit.org/en/why-we-believe-fake-news-english-subtitle/",
    "date": "27/12/2018-12:00"
    },
    {
    "thumbnail": "https://teyit.org/wp-content/uploads/2018/12/fotografin-paristeki-bir-duvara-zulum-1789da-basladi-yazildigini-gosterdigi-iddiasi-378x300.jpg",
    "title": "The claim that a photo shows a graffiti “Tyranny began in 1789” on a wall in Paris",
    "url_slug": "the-claim-that-a-photo-shows-a-graffiti-tyranny-began-in-1789-on-a-wall-in-paris",
    "author": "Alican Acanerler",
    "link": "https://teyit.org/en/the-claim-that-a-photo-shows-a-graffiti-tyranny-began-in-1789-on-a-wall-in-paris/",
    "date": "21/12/2018-16:14"
    }
]
```
- `GET https://teyit-scrapper-api.herokuapp.com/fact/:url_slug`
`RESPONSE`: 
```javascript
{
    "title": "The claim that a photo shows a graffiti “Tyranny began in 1789” on a wall in Paris",
    "claim": ": “Tyranny began in 1789” was written on a wall during the demonstrations in Paris.",
    "author": "Alican Acanerler",
    "proven": false,
    "images": [
    "https://teyit.org/wp-content/uploads/2018/12/zulum-1789-da.png",
    "https://teyit.org/wp-content/uploads/2018/12/paris-sarı-yelekliler-istifa-et.png",
    "https://teyit.org/wp-content/uploads/2018/12/sarı-yelekliler-paris-eylem.png",
    "https://teyit.org/wp-content/uploads/2018/12/sarı-yelekliler-zulüm-1789-da-basladı.png",
    "https://teyit.org/wp-content/uploads/2018/12/paris-zafer-taki-shop.png",
    "https://teyit.org/wp-content/uploads/2018/12/bobiler-istifa-et.png",
    "https://teyit.org/wp-content/uploads/2018/12/sarı-yelekliler-paris.png",
    "https://teyit.org/wp-content/uploads/2018/12/paris-sarı-yelek.png"
    ],
    "date": "21/12/2018-16:14",
    "content": "President Recep Tayyip Erdoğan said “I hope we do not see a graffiti like..."
}
```