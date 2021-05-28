# recipe
-Logowanie użytkownika (zawartość aplikacji powinna być dostępna tylko dla zalogowanych
użytkowników) - użytkowników możesz wpisać bezpośrednio do bazy danych.
+ zrobiłem logowanie, rejestrację i wylogowanie
/auth/ - rejestracja
/auth/login - logowanie
/auth/logout - wylogowanie
Zawartość, czyli CRUD bez D, bo nie było wymagane jest chroniona przez token 
i niezalogowany użytkownik nie będzie mógł wprowadzić zmian w bazie danych.

- Implementacja 2 typów użytkowników: zwykły użytkownik oraz admin (nie jest wymagana
możliwość rejestracji konta admina z poziomu aplikacji - konto admina może być dodane “na
sztywno” do bazy danych).
+ zwykły użytkownik może wyświetlać i edytować tylko swoje przepisy,
a administrator ma pełną władzę nad nimi

- Endpoint zwracający listę przepisów(*plusem będzie implementacja paginacji).
+ jw. zwykły użytkownik może wyświetlać i edytować tylko swoje przepisy,
a administrator ma pełną władzę nad nimi. Zrobione ze stronicowaniem.

- Endpoint zwracający konkretny przepis
+zwraca przepisy po id

- Dla zalogowanych użytkowników możliwość dodania nowego przepisu oraz edycja
istniejącego przepisu (oczywiście przepisu, którego autorem jest zalogowany użytkownik).
+ administrator może edytować przepisy wszystkich użytkowników, a użytkownik tylko swoje.

- Dla zalogowanego administratora powinna być możliwość przeglądania przepisów wszystkich
użytkowników
+ nawet edytować może

- Zdjęcia przepisów mogą być przechowywane w postaci adresów URL
+ tu nie miałem pomysłu, więc założyłem, że zdjęcia są w folderze, a ścieżka do niego 
zapisywana jest w bazie

Dodatkowa funkcjonalność:
(nieobowiązkowe, ale dodatkowo punktowane)

* Stworzenie dokumentacji API (np. z użyciem narzędzia Swagger).
+ to chyba jedyna rzecz, której nie zrobiłem.

* Implementacja wyszukiwania przepisu po nazwie (partial lub full text search).
+ zrobiłem wyszukiwanie po dokładnej nazwie

Wykorzystana baza danych: MongoDB
Biblioteki:
  "dependencies": {
    "bcrypt": "^5.0.1",
    + hashowanie i porównywanie haseł
    "cookie-parser": "^1.4.5",
    + dzięki niemu ciasteczka są widoczne w req.cookie (użyte do tokenów
    ciasteczka HTTP-only)
    "express": "^4.17.1",
    + głównie routing
    "jsonwebtoken": "^8.5.1",
    + token do logowania i rozróżniania użytkowników na administratora i zwykłych
    "mongoose": "^5.12.11"
    + do zarządzania MongoDB
  },
  "devDependencies": {
    "dotenv": "^10.0.0",
    + zmienne środowiskowe - baza danych i hasło do tokena
    "nodemon": "^2.0.7"
    + automatyczny restart serwera
  }
  
  
