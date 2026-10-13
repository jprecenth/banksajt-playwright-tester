- **EC2 Instance-länk:**
    http://ec2-13-48-194-153.eu-north-1.compute.amazonaws.com:3000/
- **Hur man startar projektet lokalt:** 
  1. Öppna *docker-compose.yml* och ändra rad 6 till: NEXT_PUBLIC_API_URL: http://localhost:3001
  2. Öppna en terminal i projektroten och skriv följande tre kommando:
      - docker compose --env-file backend/.env up -d mysql
      - docker compose --env-file backend/.env up -d express
      - docker compose --env-file backend/.env up -d --build nextjs
  3. Öppna http://localhost:3000 🐷🪙🪙🪙
- **Miljövariabler som behövs:**
    1. JWT_SECRET
    2. JWT_SECRET_TEST 
- **Hur man kör testerna:** 
  1. Starta test-databasen i projektroten:
      - docker compose -f docker-compose-test.yml up -d
  2. Gå sedan till /frontend och kör testerna: 
     - cd frontend
     - npm test
- **Svar på säkerhetsfrågorna:**
  1. Varför kan du läsa en JWT-payload utan signeringsnyckeln, och vad skyddar signaturen?
     - Payload:en innehåller ID och giltighetstid token, och den är inte krypterad, vilket gör att du kan läsa den. Signaturen bekräftar att token är äkta, och skyddar därmed integriteten.
  2. Vad händer om någon stjäl en giltig token innan den går ut? Stoppar en signatur den personen?
     - Nej, en signatur stoppar inte den personen, då token är giltig tills den går ut och kan användas av den person som får tag på den.
  3. Vad är skillnaden mellan att hasha ett lösenord och att signera en token?
     - Lösenordet hashas för att kunna lagras i en databas som läsbar text, och inte utgöra en risk vid eventuella säkerhetsproblem. Signering av token verifierar att användaren och requesten är genuina och omodifierade och att datan som begärs kan visas. 
  4. Vilken risk finns med att lagra en token i localStorage om sidan får en XSS-sårbarhet?
     - När den utsatta användaren navigerar på sidan så kommer dess information, inklusive token, läsas av korrupt JS-kod och därmed delas genom sårbarheten.
  5. Varför kan servern inte automatiskt veta att en JWT ska sluta gälla när användaren klickar på Logga ut?
     - För att JWT rensas från ett React State i frontend, och det delas inte med backend/servern. Token har en inbyggd tid för när den ska gå ut och sluta gälla. 
  6. Vilka hemligheter finns i ert projekt, och var ska de lagras lokalt, i GitHub Actions och på EC2?
     - Miljövariabler som förvaras lokalt i .env; EC2_HOST, EC2_SSH_KEY och EC2_USERNAME som förvaras som Secrets i GitHub Actions; användares lösenord förvaras inte oförändrade i databasen, utan lagras hashade.   
- **Länk till en grön GitHub Actions-körning:**