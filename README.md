STEPS FOR MIGRATING LOCAL SQL DATABASE TO AZURE.

1. CREATE AN AZURE ACCOUNT.
2. CREATE AN AZURE RESOURCE GROUP
3. CREATE A RESOURCE FOR THE WEB API BACK END DON'T DEPLOY YOUR CODE YET.

4. CREATE SQL DATABASE AND DATABASE INSTANCE WITH SERVER.
5. CREATE A SERVER ADMIN LOG IN AND SAVE IT. (WILL NEED THESE CREDENTIALS FOR LOGGING ON WITH SQL SERVER MANAGER)
DO LOCAL REDUNDANT BACKUP STORAGE FOR CHEAPER.
GET THE CONNECTION STRINGS FOR THE WEB API AND PUT THEM IN THE APP SETTINGS JSON
I USED DEFAULT CONNECTION CAN USE PRODUCTION Connection
TAKE FULL CONNECTION STRING AND PASTE IT IN THE APP SETTINGS JSON AND REPLACE USER ID PLACEHOLDER WITH USER NAME FROM #5 AND YOUR PASSWORD PLACEHOLDER WITH PASSWORD
FROM #5.
IN THE TUTORIAL HE PUT THE PROD CONNECTION VARIABLE IN THE PROGRAM.CS FILE  IN OPTIONS.uSEsQLsERVER(BUILDER.CONFIGURATION.GETCONNECTIONSTRING("PRODCONNECTION"))
it is in the repositories where default connection is made to connect to the database
6. TAKE THE SERVER VALUE FROM THE CONNECTION STRING, STARTING FROM tcp: TO THE FIRST SEMICOLON 1433;
7. THEN CONNECT TO THE REMOTE SERVER/DATABASE ON YOUR LOCAL SQL SERVER MANAGER
IN THE TUTORIAL HE PUT THE SERVER VALUE FROM THE CONNECTION STRING IN THE SERVER NAME IN THE CONNECT TO SERVER POP UP. BUT THE NAME OF MY SERVER WAS ALREADY
THERE,  CHOOSE SQL SERVER AUTHENTICATION FOR THE AUTHENTICATION. THEN USE THE CREDENTIALS FROM #5
8. THEN SIGN IN WITH MICROSOFT AZURE CREDENTIALS, THEN YOU WILL HAVE TO GO BACK TO THE AZURE WEB SITE, FIND THE SQL DATABASE SERVER PAGE , CHOOSE SET FIREWALL RULES
CHOOSE ADD YOUR CLIENT IPV4 ADDRESS AS A NEW FIREWALL RULE. IT SHOULD FILL IT ALL IN FOR YOU.
9. THERE SHOULD BE NO TABLES SO GO TO THE LOCAL VERSION RIGHT CLICK ON EACH TABLE ONE AT A TIME AND SELECT  SCRIPT TABLE AS/  CREATE T0 / NEW QUERY EDITOR WINDOW
10. COPY THE CREATE QUERY THAT IS GENERATED THEN IN THE AZURE DATABASE BELOW THE LOCAL ONE RIGHT CLICK ON THE DATBASE AND SELECT NEW QUERY.
11. PASTE THE COPIED QUERY INTO THE NEW QUERY WINDOW IN THE NEW AZURE DATABASE. IF YOU NAMED YOUR DATABASE SOMETHING DIFFERENT THAN THE LOCAL NAME YOU WILL HAVE
TO CHANGE THE USE DATABASE TO THE NAME YOU GAVE THE AZURE ONE.
12. FOLLOW THE COPY PASTE PROCESS FOR ALL OF THE TABLES THE LOCAL DATABASE HAS.
13 IF YOU HAVE VIEWS MAKE SURE YOU CREATE THE SCHEMAS YOU WILL BE USING, IN THIS DATABASE WE HAVE A SCHEMA NAMED AGGREGATE
14. I HAD TO GENERATE A NEW QUERY EDITOR LIKE ABOVE AND RUN CREATE SCHEMA AGGREGATE.
15. YOU WILL NEED THE ABOVE SCHEMA BEFORE CREATING THE VIEWS WHERE A TEMP OR VIRTUAL TABLE IS CREATED FROM MULTIPLE TABLES.
16. FIND IN THE LOCAL DATABASE WHERE THE VIEWS ARE STORED. SHOULD BE DATABASE/VIEWS DO THE SAME THING RT MOUSE CLICK, SCRIPT VIEW AS /CREATE TO / NEW QUERY EDITOR
17. RT MOUSE CLICK ON AZURE DATABASE AND GENERATE NEW QUERY.
18. AFTER YOU HAVE CREATED THE VIEWS YOU WILL NEED TO CREATE THE TYPES YOU WILL USE FOR THE STORED PROCEDURES.
19. THE TYPES ARE STORED AT DATABASE/ PROGRAMMIBILITY/ TYPES.
20. FOLLOW THE SAME WORKFLOW OF SCRIPT user defined table TYPE AS / CREATE TO / NEW QUERY EDITOR  WINDOW AND RUN THAT QUERY IN A NEW EDITOR WINDOW IN THE AZURE DATABASE.
21. WITH THE TYPES COMPLETED YOU ARE READY TO DO THE SAME THING WITH THE STORED PROCEDURES. COPY A QUERY FROM SCRIPT STORED PROC AS/ CREATE TO / then  NEW QUERY
22. THEN RUN THE QUERY IN THE AZURE DB.

