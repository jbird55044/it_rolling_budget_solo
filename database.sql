CREATE TABLE "t_user_owner" (
   "id" SERIAL PRIMARY KEY,
   "username" VARCHAR (60) UNIQUE NOT NULL,
   "password" VARCHAR (60) NOT NULL,
   "full_name" VARCHAR (60) NOT NULL,
   "business_unit" VARCHAR(30),
   "bu_description" VARCHAR(80)
);


CREATE TABLE "tlist_capitalized_life" (
   "id" SERIAL PRIMARY KEY,
   "life" INT,
   "life_nominclature" VARCHAR(20)
);


CREATE TABLE "tlist_cost_center" (
   "id" SERIAL PRIMARY KEY,
   "owner_fk" INT REFERENCES "t_user_owner",
   "cost_center" VARCHAR(12),
   "cc_accounting" VARCHAR(30),
   "cost_center_description" VARCHAR(125)
);

CREATE TABLE "tlist_expenditure_type" (
   "id" SERIAL PRIMARY KEY,
   "owner_fk" INT REFERENCES "t_user_owner",
   "expenditure_type" VARCHAR(50),
   "expenditure_description" VARCHAR(125)
);

CREATE TABLE "tlist_frequency" (
   "id" SERIAL PRIMARY KEY,
   "frequency" VARCHAR(30),
   "description" VARCHAR(80)
);


CREATE TABLE "tlist_gl_code" (
   "id" SERIAL PRIMARY KEY,
   "gl_account" VARCHAR(20),
   "gl_name" VARCHAR(60),
   "gl_type" VARCHAR(60),
   "gl_examples" VARCHAR(100),
   "show_in_list" BOOLEAN
);


CREATE TABLE "tlist_point_person"(
   "id" SERIAL PRIMARY KEY,
   "owner_fk" INT REFERENCES "t_user_owner",
   "point_person" VARCHAR(50),
   "pp_email_address" VARCHAR(80)
);


CREATE TABLE "tlist_year" (
   "id" SERIAL PRIMARY KEY,
   "year" INT
);

CREATE TABLE "tlist_period" (
   "id" SERIAL PRIMARY KEY,
   "period" INT,
   "period_description" VARCHAR (20)
);

CREATE TABLE "t_primary_budget" (
   "id" serial PRIMARY KEY,
   "owner_fk" INT REFERENCES "t_user_owner",
   "gl_code_fk" INT REFERENCES "tlist_gl_code",
   "cost_center_fk" INT REFERENCES "tlist_cost_center",
   "point_person_fk" INT REFERENCES "tlist_point_person",
   "nomenclature" VARCHAR(80),                               
   "manufacturer" VARCHAR(80),
   "frequency_fk" INT REFERENCES "tlist_frequency" DEFAULT 1,
   "expenditure_type_fk" INT REFERENCES "tlist_expenditure_type" DEFAULT 1,
   "capitalizable_candidate" BOOLEAN,
   "capitalize_life_fk" INT REFERENCES "tlist_capitalized_life" DEFAULT 1,
   "credit_card_use" BOOLEAN DEFAULT false,
   "needs_review" BOOLEAN DEFAULT false,
   "notes" TEXT,
   "last_update" TIMESTAMP,
   "archived" BOOLEAN DEFAULT false 
);

CREATE TABLE "t_primary_expenditure" (
   "id" SERIAL PRIMARY KEY,
   "budget_fk" INT REFERENCES "t_primary_budget",
   "period" VARCHAR(2),
   "year" VARCHAR(4),
   "amount" INT NOT NULL,
   "expense_note" VARCHAR(80),
   "archived" BOOLEAN DEFAULT false
);


--  Update
UPDATE t_primary_budget SET nomenclature = 'test', manufacturer = 'test', capitalizable_candidate = true WHERE id=11;


--  Formfill Select

WITH _t_primary_budget AS 
  ( 
  SELECT t_primary_budget.id, nomenclature, manufacturer, capitalizable_candidate, credit_card_use, needs_review, notes, last_update,
  t_user_owner.business_unit, 
  tlist_gl_code.id AS gl_code_fk, tlist_gl_code.gl_account, tlist_gl_code.gl_name, tlist_gl_code.gl_type, tlist_gl_code.gl_examples,  
  tlist_cost_center.id AS cost_center_fk, tlist_cost_center.cost_center, tlist_cost_center.cost_center_description,
  tlist_point_person.id AS point_person_fk,tlist_point_person.point_person, tlist_point_person.pp_email_address,
  tlist_frequency.id AS frequency_fk,tlist_frequency.frequency, tlist_frequency.description, 
  tlist_expenditure_type.id AS expenditure_type_fk, tlist_expenditure_type.expenditure_type, tlist_expenditure_type.expenditure_description, 
  tlist_capitalized_life.id AS capitalize_life_fk, tlist_capitalized_life.life, tlist_capitalized_life.life_nominclature,
  row_number() over (PARTITION BY t_primary_budget.owner_fk ORDER BY t_primary_budget.id ASC) AS row_number
FROM t_primary_budget
  JOIN t_user_owner ON t_user_owner.id = t_primary_budget.owner_fk
  JOIN tlist_gl_code ON tlist_gl_code.id = t_primary_budget.gl_code_fk
  JOIN tlist_cost_center ON tlist_cost_center.id = t_primary_budget.cost_center_fk
  JOIN tlist_frequency ON tlist_frequency.id = t_primary_budget.frequency_fk
  JOIN tlist_point_person ON tlist_point_person.id = t_primary_budget.point_person_fk
  JOIN tlist_expenditure_type ON tlist_expenditure_type.id = t_primary_budget.expenditure_type_fk
  JOIN tlist_capitalized_life ON tlist_capitalized_life.id = t_primary_budget.capitalize_life_fk
  WHERE t_primary_budget.owner_fk = 1 AND archived = false
)
  SELECT * FROM _t_primary_budget WHERE row_number > 0;
  

	DELETE FROM t_primary_expenditure WHERE id=10;





  SELECT COUNT (t_primary_budget.*) FROM t_primary_budget WHERE owner_fk = 1 AND archived = false;
  
  SELECT SUM(t_primary_expenditure.amount) FROM t_primary_expenditure
  JOIN t_primary_budget ON t_primary_budget.id = t_primary_expenditure.budget_fk
  WHERE t_primary_budget.owner_fk = 1 AND archived = false AND t_primary_budget.id = 28;
  
 SELECT SUM(t_primary_expenditure.amount) FROM t_primary_expenditure
  WHERE t_primary_expenditure.budget_fk = 28;

  
SELECT *  FROM t_primary_expenditure
    WHERE t_primary_expenditure.budget_fk  = 28
    ORDER BY year, period, id ASC;
   
  
-- Report 1 Query
SELECT t_primary_budget.id, nomenclature, manufacturer, capitalizable_candidate, credit_card_use, needs_review, notes, last_update,
  t_user_owner.business_unit, 
  tlist_gl_code.id AS gl_code_fk, tlist_gl_code.gl_account, tlist_gl_code.gl_name, tlist_gl_code.gl_type, tlist_gl_code.gl_examples,  
  tlist_cost_center.id AS cost_center_fk, tlist_cost_center.cost_center, tlist_cost_center.cost_center_description,
  tlist_point_person.id AS point_person_fk,tlist_point_person.point_person, tlist_point_person.pp_email_address,
  tlist_frequency.id AS frequency_fk,tlist_frequency.frequency, tlist_frequency.description, 
  tlist_expenditure_type.id AS expenditure_type_fk, tlist_expenditure_type.expenditure_type, tlist_expenditure_type.expenditure_description, 
  tlist_capitalized_life.id AS capitalize_life_fk, tlist_capitalized_life.life, tlist_capitalized_life.life_nominclature,
  SUM(t_primary_expenditure.amount) as total
FROM t_primary_budget
  JOIN t_user_owner ON t_user_owner.id = t_primary_budget.owner_fk
  JOIN tlist_gl_code ON tlist_gl_code.id = t_primary_budget.gl_code_fk
  JOIN tlist_cost_center ON tlist_cost_center.id = t_primary_budget.cost_center_fk
  JOIN tlist_frequency ON tlist_frequency.id = t_primary_budget.frequency_fk
  JOIN tlist_point_person ON tlist_point_person.id = t_primary_budget.point_person_fk
  JOIN tlist_expenditure_type ON tlist_expenditure_type.id = t_primary_budget.expenditure_type_fk
  JOIN tlist_capitalized_life ON tlist_capitalized_life.id = t_primary_budget.capitalize_life_fk
  JOIN t_primary_expenditure ON t_primary_budget.id = t_primary_expenditure.budget_fk 
      WHERE t_primary_budget.owner_fk = 1 AND t_primary_budget.archived = false AND t_primary_expenditure.year = '2021'
      GROUP BY t_primary_budget.id, t_primary_expenditure.budget_fk, t_user_owner.business_unit, tlist_gl_code.id, 
        tlist_cost_center.id, tlist_point_person.id, tlist_frequency.id, tlist_expenditure_type.id, tlist_capitalized_life.id
      ORDER BY t_primary_budget.id ASC
;


-- report 2
SELECT t_primary_budget.id, nomenclature, manufacturer, capitalizable_candidate, credit_card_use, needs_review, notes, last_update,
  t_user_owner.business_unit, 
  tlist_gl_code.id AS gl_code_fk, tlist_gl_code.gl_account, tlist_gl_code.gl_name, tlist_gl_code.gl_type, tlist_gl_code.gl_examples,  
  tlist_cost_center.id AS cost_center_fk, tlist_cost_center.cost_center, tlist_cost_center.cost_center_description,
  tlist_point_person.id AS point_person_fk,tlist_point_person.point_person, tlist_point_person.pp_email_address,
  tlist_frequency.id AS frequency_fk,tlist_frequency.frequency, tlist_frequency.description, 
  tlist_expenditure_type.id AS expenditure_type_fk, tlist_expenditure_type.expenditure_type, tlist_expenditure_type.expenditure_description, 
  tlist_capitalized_life.id AS capitalize_life_fk, tlist_capitalized_life.life, tlist_capitalized_life.life_nominclature,
  t_primary_expenditure.amount
FROM t_primary_budget
  JOIN t_user_owner ON t_user_owner.id = t_primary_budget.owner_fk
  JOIN tlist_gl_code ON tlist_gl_code.id = t_primary_budget.gl_code_fk
  JOIN tlist_cost_center ON tlist_cost_center.id = t_primary_budget.cost_center_fk
  JOIN tlist_frequency ON tlist_frequency.id = t_primary_budget.frequency_fk
  JOIN tlist_point_person ON tlist_point_person.id = t_primary_budget.point_person_fk
  JOIN tlist_expenditure_type ON tlist_expenditure_type.id = t_primary_budget.expenditure_type_fk
  JOIN tlist_capitalized_life ON tlist_capitalized_life.id = t_primary_budget.capitalize_life_fk
  JOIN t_primary_expenditure ON t_primary_budget.id = t_primary_expenditure.budget_fk 
      WHERE t_primary_budget.owner_fk = 2 AND t_primary_budget.archived = false AND t_primary_expenditure.year = '2021'
      ORDER BY t_primary_budget.id ASC
  ;
  
  
--   Report 3 ----
SELECT t_primary_budget.id, nomenclature, manufacturer, capitalizable_candidate, credit_card_use, needs_review, notes, last_update,
  t_user_owner.business_unit, 
  tlist_gl_code.id AS gl_code_fk, tlist_gl_code.gl_account, tlist_gl_code.gl_name, tlist_gl_code.gl_type, tlist_gl_code.gl_examples,  
  tlist_cost_center.id AS cost_center_fk, tlist_cost_center.cost_center, tlist_cost_center.cost_center_description,
  tlist_point_person.id AS point_person_fk,tlist_point_person.point_person, tlist_point_person.pp_email_address,
  tlist_frequency.id AS frequency_fk,tlist_frequency.frequency, tlist_frequency.description, 
  tlist_expenditure_type.id AS expenditure_type_fk, tlist_expenditure_type.expenditure_type, tlist_expenditure_type.expenditure_description, 
  tlist_capitalized_life.id AS capitalize_life_fk, tlist_capitalized_life.life, tlist_capitalized_life.life_nominclature,
  SUM(t_primary_expenditure.amount) as total
FROM t_primary_budget
  JOIN t_user_owner ON t_user_owner.id = t_primary_budget.owner_fk
  JOIN tlist_gl_code ON tlist_gl_code.id = t_primary_budget.gl_code_fk
  JOIN tlist_cost_center ON tlist_cost_center.id = t_primary_budget.cost_center_fk
  JOIN tlist_frequency ON tlist_frequency.id = t_primary_budget.frequency_fk
  JOIN tlist_point_person ON tlist_point_person.id = t_primary_budget.point_person_fk
  JOIN tlist_expenditure_type ON tlist_expenditure_type.id = t_primary_budget.expenditure_type_fk
  JOIN tlist_capitalized_life ON tlist_capitalized_life.id = t_primary_budget.capitalize_life_fk
  JOIN t_primary_expenditure ON t_primary_budget.id = t_primary_expenditure.budget_fk 
      WHERE t_primary_budget.owner_fk = 1 AND t_primary_budget.archived = false AND t_primary_expenditure.year = '2021' AND needs_review = true
      GROUP BY t_primary_budget.id, t_primary_expenditure.budget_fk, t_user_owner.business_unit, tlist_gl_code.id, 
        tlist_cost_center.id, tlist_point_person.id, tlist_frequency.id, tlist_expenditure_type.id, tlist_capitalized_life.id
        ORDER BY t_primary_budget.id ASC
;

SELECT SUM(t_primary_expenditure.amount) FROM t_primary_expenditure
JOIN t_primary_budget ON t_primary_budget.id = t_primary_expenditure.budget_fk
  WHERE t_primary_budget.owner_fk = 2 
    AND t_primary_budget.archived = false 
    AND t_primary_expenditure.archived = false
    AND t_primary_expenditure.year = '2021'
  ;


--  provides relative row to actual record ID
WITH _t_primary_budget AS 
  ( 
  SELECT t_primary_budget.id, 
  row_number() over (PARTITION BY t_primary_budget.owner_fk ORDER BY t_primary_budget.id ASC) AS row_number
FROM t_primary_budget
  JOIN t_user_owner ON t_user_owner.id = t_primary_budget.owner_fk
  WHERE t_primary_budget.owner_fk = 1 AND archived = false
)
  SELECT * FROM _t_primary_budget WHERE id=128;



-- experiment --



  
  

-- end of experiment --


SELECT *
FROM t_primary_expenditure
JOIN tlist_period ON tlist_period.id = t_primary_expenditure.period_fk
JOIN tlist_year ON tlist_year.id = t_primary_expenditure.period_fk
WHERE t_primary_expenditure.budget_fk = 128;



--  VALUES. -------------
-- password for all accounts are 'password' by default

INSERT INTO "t_user_owner" ("username", "password", "full_name", "business_unit", "bu_description") VALUES 
('jbird', '$2a$10$8FSuLLBt/POkuZfjc386wudEF5b66z4t97b6S5TL8Ws6VgInGVUp2', 'James Bird','BT', 'Business Technology'),
('mark', '$2a$10$8FSuLLBt/POkuZfjc386wudEF5b66z4t97b6S5TL8Ws6VgInGVUp2', 'Marketing Leader','BD', 'Business Development'),
('jbird3', '$2a$10$8FSuLLBt/POkuZfjc386wudEF5b66z4t97b6S5TL8Ws6VgInGVUp2', 'James Bird3','GO', 'Geo-Spacial Design'), 
('jbird4', '$2a$10$8FSuLLBt/POkuZfjc386wudEF5b66z4t97b6S5TL8Ws6VgInGVUp2', 'James Bird4','MD', 'Marketing and Digital');


INSERT INTO "tlist_capitalized_life" ("life","life_nominclature") VALUES
(0, 'Not Cap'),
(3, '3 Years'),
(4, '4 Years'),
(5, '5 Years');

INSERT INTO "tlist_cost_center" ("owner_fk", "cost_center", "cc_accounting", "cost_center_description") VALUES
(1, 'BT_Mgt', 'BT Management', 'BT Management & Admin'),
(1, 'BTAD', 'Application Development', 'Developers, DBA'),
(1, 'BTEN', 'Platform Engineering', 'Engineers, System Architects'),
(1, 'BTPM', 'Project Management', 'PMO, PMs, BAs'),
(1, 'BTOP', 'BT Operations', 'HD Support & ITSM'),
(2, 'BDMK', 'BD Marketing', 'Marketing & Int-Comm'),
(2, 'BDBD', 'Business Development', 'Lead Gen, Wordpress'),
(2, 'BDEC', 'E-Comm', 'E-Comm, Advertising'),
(3, 'GOOP', 'GO Operations', 'All Staff &Ops');

INSERT INTO "tlist_expenditure_type" ("owner_fk", "expenditure_type", "expenditure_description") VALUES
(1,'Cash Purchase','Cash on the Barrelhead'),
(1,'Subscription','Monthly - No End in Sight'),
(1,'Software Maintenance','Typically Annual, Maintenance for Software Platforms'),
(1,'Hardware Maintenance','Typically Annual, Maintnenace for Hardware Platforms'),
(1,'Headcount Salary','Salary and Employee paid expenses'),
(1,'Supplement Headcount','Contract to Suppliment, SOW'),
(1,'Inside Money','Intra-Department Cash Flow'),
(1,'Managed Service','Typically Monthly for operational maintenance of platforms'),
(1,'Project SWAG','Placeholder for an all encompassing project'),
(2,'Internal Costs','Software, CODB, KTLO'),
(2,'Professional Services','Paying Somone Else to do the work'),
(2,'Design Firms','Dedidacated and Commited Outside Services'),
(2,'SOW Headcount','Project Specific Headcount'),
(2,'Internal Headcount','Internal Headcount, Full &Part');


INSERT INTO "tlist_frequency" ("frequency", "description") VALUES
('OneTime','Once - Non Repeating'),
('Monthly','12 Times a year'),
('PerPeriod','13 Times a year'),
('Quarterly','4 Times a year'),
('SemiAnnual','2 Times a Year'),
('Annual','1 Time a Year');

INSERT INTO "tlist_gl_code" ("gl_account", "gl_name", "gl_type", "gl_examples", "show_in_list") VALUES
('153000','Prepaid Expense - Other','Asset','Do Not Use','False'),
('175000','Computer Equipment','Asset','Computer Hardware over $1000, Network Gear, WAPS, Servers, etc','True'),
('175500','Software','Asset','Purchased Software over $1000, like Monitoring Software, Virus, etc.','True'),
('611000','Salaries - Temporary','Indirect Salaries','Contract workers, Staff Aug, like Try B4 you buy','True'),
('622000','Employee Relations','Employee Related','Fun Money for Department Events, Like Bowling','True'),
('623000','Books & Publications','Employee Related','Books, Educational Subscriptions, light web training','True'),
('623500','Seminars','Employee Related','External Seminar Event, Like vmWorld','True'),
('623600','Training','Employee Related','External Traing Event, Like New Horizons (class only)','True'),
('623800','Education/Tuition Reimbursement','Employee Related','Pre-Approved Degree Tuition','True'),
('624000','Professional Certifications and Licensure Fees','Employee Related','Individual Certifications, like Cisco CSNE, (cert/Test only)','True'),
('624200','Membership Dues for Professional Societies','Employee Related','Not common outside Business Operations','True'),
('625000','Recruiting','Employee Related','For Fulltime Recruiters, 20% of Base type','True'),
('629000','Other Employee Related','Employee Related','Anything that doesnt fit other Employee categories','True'),
('647500','Cellphones','Facilities','Physical Cell Phone purchases','True'),
('647501','Cell Phone Reimbursement','Facilities','Salary Stipens for Cell Phones','True'),
('651100','Airfare','Travel & Entertainment','All Airfair including that of training, office visits, etc.','True'),
('651200','Hotel & Lodging','Travel & Entertainment','All Hotel including that of training, office visits, etc.','True'),
('651300','Vehicle Travel Expenses','Travel & Entertainment','Rental Car and Parking, No Mileage','True'),
('652000','Travel - Meals','Travel & Entertainment','All Meals, travel or not','True'),
('653000','Travel Mileage','Travel & Entertainment','Use to get to other office, or training, etc. (like .56 x miles)','True'),
('655000','Entertainment','Travel & Entertainment','Client Related Only','True'),
('682000','Consultants & Subcontractors','Professional Services','Assignment/Project Specific like a StoneRidge','True'),
('684000','Software Development Services','Professional Services','Do Not Use (AFW Only)','False'),
('600000','Computer Service','Computer Services','Catch All for Service Related Items','True'),
('690100','Computer Svs - I/C Managed Services','Computer Services','(AFW Only)','False'),
('690600','Hardware Maintenance Agreement','Computer Services','Hardware Maintenance, Like HP Server Maintenance- $6k or more','True'),
('690700','Software Support Agreement','Computer Services','Software Maintenance, Like EA, 20% of license costs - $6k or more','True'),
('690800','Service Agreements','Computer Services','Managed Services, like OneNeck, HPC Host','True'),
('691000','Computer Supplies','Computer Services','All the small stuff Under $1000','True'),
('691500','Software- non capitalized','Computer Services','Small software under $1000','True'),
('692000','Computer Training','Computer Services','Do Not Use','False'),
('693000','Computer Equip Leasing','Computer Services','Do Not Use','False'),
('694500','Other Computer Expenses','Computer Services','Do Not Use','False'),
('611001','Salary for FTE Headcount','Employee Related','For Headcount - Annual divided by 13 listed by period','True'),
('680000','New Projects','Computer Services','For New Project SWAGs, Capitalized','True');

INSERT INTO "tlist_point_person" ("owner_fk", "point_person", "pp_email_address") VALUES
 (1,'Jim Bird', 'jbird@JamesDBird.com'),
 (1,'John Smith', 'jsmith@company.com'),
 (1,'Mary Jones', 'mjones@company.com'),
 (1,'Sue Peters', 'speters@company.com'),
 (1,'Sam Astron', 'sastron@company.com'),
 (2,'Timmy Toneson', 'ttoneson@company.com'),
 (2,'Mary Olsen', 'molson@company.com'),
 (2,'Jon Cars', 'jcars@company.com'),
 (2,'Gregory Gains', 'ggains@company.com');

 INSERT INTO "tlist_year" ("year") VALUES
 (2018),
 (2019),
 (2020),
 (2021),
 (2022),
 (2023),
 (2024),
 (2025);

INSERT INTO "tlist_period" ("period", "period_description") VALUES
(1, 'Period 1'),
(2, 'Period 2'),
(3, 'Period 3'),
(4, 'Period 4'),
(5, 'Period 5'),
(6, 'Period 6'),
(7, 'Period 7'),
(8, 'Period 8'),
(9, 'Period 9'),
(10, 'Period 10'),
(11, 'Period 11'),
(12, 'Period 12'),
(13, 'Period 13');

INSERT INTO t_primary_budget(owner_fk,gl_code_fk,cost_center_fk,point_person_fk,nomenclature,manufacturer,frequency_fk,expenditure_type_fk,capitalizable_candidate,capitalize_life_fk,credit_card_use,needs_review,notes,last_update,archived) VALUES
 (1,21,2,5,'AX User Group in Fargo (5 people) - Mileage Travel',NULL,1,1,'FALSE',1,'FALSE','FALSE','Ravi+Developers + Stina','2017-10-19 13:47:54','FALSE')
,(1,20,2,5,'AX User Group in Fargo (5 people) - Meals',NULL,1,1,'FALSE',1,'TRUE','FALSE','Ravi+Developers + Stina','2017-10-19 13:48:01','FALSE')
,(1,18,1,1,'AX User Group in Fargo (1 people) - Hotel',NULL,1,1,'FALSE',1,'TRUE','FALSE',NULL,'2017-09-05 13:58:43','FALSE')
,(1,20,1,1,'AX User Group in Fargo (1 people) - Meals',NULL,1,1,'FALSE',1,'TRUE','FALSE',NULL,'2017-09-05 13:58:40','FALSE')
,(1,17,5,2,'Texas Office WAN Installs - Airfare',NULL,1,1,'FALSE',1,'TRUE','FALSE','For Engineer to install office gear','2017-10-17 11:05:43','FALSE')
,(1,17,2,5,'Data  Conference (Shyam)',NULL,1,1,'FALSE',1,'TRUE','FALSE',NULL,'2019-09-20 10:51:38','FALSE')
,(1,18,2,5,'Data  Conference (Shyam)',NULL,1,1,'FALSE',1,'TRUE','FALSE',NULL,'2019-09-20 10:51:19','FALSE')
,(1,20,2,5,'Data  Conference (Shyam)',NULL,1,1,'FALSE',1,'TRUE','FALSE',NULL,'2019-09-20 10:50:59','FALSE')
,(1,19,2,5,'Data  Conference (Shyam)',NULL,1,1,'FALSE',1,'TRUE','FALSE',NULL,'2019-09-20 10:50:37','FALSE')
,(1,8,2,5,'Data  Conference (Shyam)',NULL,1,1,'FALSE',1,'TRUE','FALSE',NULL,'2019-09-20 10:50:20','FALSE')
,(1,6,1,1,'Two BT events Annually',NULL,1,1,'FALSE',1,'TRUE','FALSE',NULL,'2017-09-05 14:53:39','FALSE')
,(1,28,5,2,'CommVault 24/7 Maintenance of CV Library','CommVault',6,3,'FALSE',1,'FALSE','FALSE',NULL,'2017-09-05 16:14:08','FALSE')
,(1,28,5,2,'vmWare Horizon View & vSphere Maintenance Renewal','VMWare',6,3,'FALSE',1,'FALSE','FALSE','11/20/17- Moved to P10 to be more accurate. Production Support Coverage Vmware Horizon Enterprise Edition, VMware Horizon 7 Enterprise','2019-10-02 08:33:25','FALSE')
,(1,28,5,2,'VMWare vSphere for Hosts','VMWare',6,3,'FALSE',1,'FALSE','FALSE','11/21/17- Cotermed agreement with other VMWare.  Thus zeroed out this one.  2017P10 saw $55k, in 2018 it will be about $63k (due to prorating of 2017 by 3 months of vsphere product.','2017-11-20 14:35:13','FALSE')
,(1,28,5,2,'Bomgar Remote Access tool Maintenance','Bomgar',6,3,'FALSE',1,'FALSE','FALSE',NULL,'2017-09-06 16:20:21','FALSE')
,(1,29,2,5,'DAX Managed Services (old)','OneNeck',2,8,'FALSE',1,'FALSE','FALSE',NULL,'2019-09-20 10:14:55','FALSE')
,(1,4,5,2,'Bomgar License - 1 additional user','Bomgar',1,1,'TRUE',2,'FALSE','FALSE',NULL,'2017-10-17 11:16:33','FALSE')
,(1,28,5,2,'OpenDNS Umbrella content filtering Subscription','Cisco',6,3,'FALSE',1,'FALSE','FALSE',NULL,'2018-01-29 09:10:01','FALSE')
,(1,28,5,2,'ASA Management Software Maintenance','Firesight',6,3,'FALSE',1,'FALSE','FALSE',NULL,'2019-09-18 13:09:44','FALSE')
,(1,28,2,5,'Pragmatic Works Task Factory','Pragmatic Works',6,1,'FALSE',1,'FALSE','FALSE','Task manager to move Power BI data to/fro','2018-10-19 14:20:35','FALSE')
,(1,29,5,2,'Marco Mitel Managed Service and Support','Marco/Loffler',6,4,'FALSE',1,'FALSE','FALSE','Moved to Service Agreement GL','2019-09-30 09:58:19','FALSE')
,(1,27,5,2,'Riverbed WAN Optimizers','Riverbed',6,4,'FALSE',1,'FALSE','FALSE',NULL,'2017-09-08 13:44:12','FALSE')
,(1,27,5,2,'ASA Firewalls - 4 total','Cisco',6,4,'FALSE',1,'FALSE','FALSE',NULL,'2017-09-08 13:45:09','FALSE')
,(1,27,5,2,'WAN Switch Block in DC1 - WS-C3650','Cisco',6,4,'FALSE',1,'FALSE','FALSE',NULL,'2017-09-08 13:46:42','FALSE')
,(1,3,5,2,'Aruba WAPs in BL1','Aruba/HP',1,1,'TRUE',4,'FALSE','FALSE',NULL,'2017-09-08 13:50:09','FALSE')
,(1,4,5,2,'Nimble SAN - 2 expansion chassises','Nimble',6,1,'FALSE',1,'FALSE','FALSE','Expansion for current drives.  Maintenance will be co-term with original purchase (18-months later).  Units for DC1 and DC2','2017-10-19 08:27:28','FALSE')
,(1,27,5,2,'F5 Load Balancers','APM',6,4,'FALSE',1,'FALSE','FALSE',NULL,'2017-09-08 14:13:26','FALSE')
,(1,27,5,2,'Batteries for Smart-UPS (renewal self maintenance)','APC',6,1,'FALSE',1,'FALSE','FALSE',NULL,'2019-09-30 10:03:32','FALSE')
,(2,22,7,8,'Coffee Press Publishing Agency','CPPA',2,14,'FALSE',1,'TRUE','FALSE','Managed Service Agency (on demand)','2021-01-18 00:00:00','FALSE')
,(2,25,6,8,'Webforms Page Development For new Website','3rd Party Smith',2,14,'TRUE',4,'FALSE','FALSE','Development Assistance already approved','2021-01-18 00:00:00','FALSE')
,(2,3,8,6,'Wordpress Upgrade','Wordpress',1,11,'TRUE',2,'FALSE','FALSE',NULL,'2021-01-18 00:00:00','FALSE')
,(1,27,5,2,'HP Blade Chassis for DC2 DRP - C7000','HP',6,4,'FALSE',1,'FALSE','FALSE',NULL,'2017-09-08 14:28:10','FALSE')
,(1,27,5,2,'Blades Servers for DC2 DRP (8 total)','HP',6,8,'FALSE',1,'FALSE','FALSE',NULL,'2017-09-08 14:29:00','FALSE')
,(1,9,4,3,'Training for PM and BA skillset (1 person)','New Horizons',1,1,'FALSE',1,'FALSE','FALSE',NULL,'2021-01-24 00:00:00','FALSE')
,(1,3,2,5,'Resharper pluging for vStudio, C#','JetBrains',1,3,'FALSE',1,'FALSE','FALSE','From Dan Leahy','2021-01-22 00:00:00','FALSE')
,(1,17,1,1,'Jim Office Visit to Dallas Area - 3 Days',NULL,1,1,'FALSE',1,'TRUE','FALSE',NULL,'2021-01-22 00:00:00','FALSE')
,(1,27,5,2,'Maintenance for Backup Server in BL2 - DL380G7','HP',6,4,'FALSE',1,'FALSE','FALSE',NULL,'2019-09-30 10:04:08','FALSE')
,(1,17,5,2,'BT Service Desk Office Visits Mileage Per Period',NULL,3,1,'FALSE',1,'TRUE','FALSE',NULL,'2021-01-22 00:00:00','FALSE')
,(1,18,1,1,'Microsoft Envision - CIO Summit, Rental Car','National',1,1,'FALSE',1,'TRUE','FALSE',NULL,'2021-01-22 00:00:00','FALSE')
,(1,17,1,1,'Microsoft Envision - CIO Summit, Orlando Airfare','Delta',1,1,'FALSE',1,'TRUE','FALSE',NULL,'2021-01-22 00:00:00','FALSE')
,(1,19,5,2,'All Company Meeting Assistance - Meals',NULL,1,1,'FALSE',1,'TRUE','FALSE','Two Trips Planned','2021-01-22 00:00:00','FALSE')
,(1,19,1,1,'Microsoft Envision - CIO Summit, Food',NULL,1,1,'FALSE',1,'TRUE','FALSE',NULL,'2021-01-22 00:00:00','FALSE')
,(1,17,5,2,'Texas Office Visits - Hotel',NULL,1,1,'FALSE',1,'TRUE','FALSE','Trip to TX to install, update WAN in offices','2021-01-22 00:00:00','FALSE')
,(1,17,2,5,'AX User Group in Fargo (5 people x 3 nights) - Hotel','Comfort Inn',1,1,'FALSE',1,'TRUE','TRUE','Ravi+Developers + Stina - waiting for approval','2021-01-24 00:00:00','FALSE')
,(1,27,5,2,'WLAN controller for BL1 - MSM760 WLAN','HP',6,4,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-01 13:36:45','FALSE')
,(1,18,5,2,'All Company Meeting Assistance - Hotel',NULL,1,1,'FALSE',1,'TRUE','FALSE','Estimated 2 trips (one w/ flights) - Rec 6','2021-01-24 00:00:00','FALSE')
,(1,28,5,2,'Softrack License Monitoring for gINT','SofTrack',6,3,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-01 11:21:39','FALSE')
,(1,27,5,2,'Security RFID Door System Maintenance','Pro-Watch',6,4,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-01 15:53:29','FALSE')
,(1,28,2,5,'OnBase Annual Maintenance - 59 simultaneous seats (Canceled)','OnBase',6,3,'FALSE',1,'FALSE','FALSE',NULL,'2021-01-22 00:00:00','FALSE')
,(1,3,5,2,'Magnetic Tapes for Archive and Storage','Quantum',1,1,'FALSE',1,'FALSE','FALSE',NULL,'2017-09-08 14:35:08','FALSE')
,(1,3,5,2,'PC /Laptop Refresh EverGreening (25% Lifecycle)','Dell',3,1,'TRUE',2,'FALSE','FALSE',NULL,'2019-09-19 11:44:02','FALSE')
,(1,25,5,2,'End Point Security - Client Side','Dell Treat Defense or similar',2,2,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-15 16:02:46','FALSE')
,(1,4,5,2,'Application Performance Monitoring System','TBD',1,1,'TRUE',2,'FALSE','FALSE',NULL,'2017-09-15 12:52:40','FALSE')
,(1,30,5,2,'Last Pass Subscription - Password Management','LastPass',2,2,'FALSE',1,'TRUE','FALSE',NULL,'2019-09-30 09:25:30','FALSE')
,(1,25,1,1,'Information Security Assessment / Testing','FRSecure',1,6,'FALSE',1,'FALSE','FALSE',NULL,'2019-10-21 14:40:41','FALSE')
,(1,4,5,2,'Site Recovery DRP for VMWare','VMWare',1,1,'TRUE',2,'FALSE','FALSE',NULL,'2017-09-15 15:47:24','FALSE')
,(1,35,2,5,'1 FTE - Data Achitect for SOA',NULL,3,5,'FALSE',1,'FALSE','FALSE',NULL,'2017-10-20 12:53:36','FALSE')
,(1,23,2,5,'1 Contractor- Report Writer (BI Project)',NULL,2,6,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-19 14:27:27','FALSE')
,(1,35,1,1,'1 FTE - Security Analyst',NULL,3,5,'FALSE',1,'FALSE','FALSE',NULL,'2019-10-21 14:41:59','FALSE')
,(1,35,5,2,'1 FTE - Technical Trainer',NULL,3,5,'FALSE',1,'FALSE','FALSE',NULL,'2017-10-20 14:26:53','FALSE')
,(1,35,5,2,'Summer Interns - 1 HC total (1of2), 4 mos',NULL,3,5,'FALSE',1,'FALSE','FALSE',NULL,'2019-09-30 10:15:01','FALSE')
,(1,35,2,5,'SOA and Data Warehouse Foundation Buildout','BIC',1,1,'TRUE',4,'FALSE','FALSE',NULL,'2018-10-19 14:23:05','FALSE')
,(1,23,2,5,'ECM / OnBase Replacement Buy/Build','BIC',2,1,'TRUE',4,'FALSE','FALSE','6 month project ending in Q3-2018','2018-10-15 16:09:02','FALSE')
,(1,3,5,2,'Access Layer Switch in BL1','HP',1,1,'TRUE',4,'FALSE','FALSE',NULL,'2017-10-12 07:01:13','FALSE')
,(1,30,5,2,'Headsets for Skype Users','Jabra',3,1,'FALSE',1,'FALSE','FALSE',NULL,'2019-09-30 09:46:21','FALSE')
,(1,23,5,2,'Integration of Mitel to O365','Marco',1,1,'TRUE',4,'FALSE','FALSE','SOW Work by Marco','2017-10-12 07:10:20','FALSE')
,(1,35,2,5,'Replace Wire w/ SharePoint Project','OnDemand',3,6,'TRUE',4,'FALSE','FALSE',NULL,'2018-10-19 11:04:02','FALSE')
,(1,7,1,1,'InfoTech Renewal Subscription- 3-year Term','InfoTech',6,1,'FALSE',1,'FALSE','FALSE',NULL,'2020-12-26 18:06:06','FALSE')
,(1,29,5,2,'Server Managed Services DC1','Insight',2,8,'FALSE',1,'FALSE','FALSE','Server Managed Services, does not include Block Hours, Co-Location, Power, or DAX /SQL managed Services','2019-09-18 16:13:05','FALSE')
,(1,29,5,2,'Managed Block Hours for Network','OneNeck / Insight',2,8,'FALSE',1,'FALSE','FALSE',NULL,'2019-09-18 16:05:41','FALSE')
,(1,29,5,2,'OneNeck Internet 200M Access','OneNeck',2,8,'FALSE',1,'FALSE','FALSE',NULL,'2017-10-12 07:49:09','FALSE')
,(1,29,5,2,'Co-Location Power (metered)','OneNeck',2,8,'FALSE',1,'FALSE','FALSE',NULL,'2019-09-18 16:08:25','FALSE')
,(1,29,5,2,'Co-Location Racks (four)','OneNeck',2,8,'FALSE',1,'FALSE','FALSE','4 Racks at $750 each - Power not included','2019-09-18 16:09:11','FALSE')
,(1,25,2,5,'MSDN Subscription (Development Tools)','MicroSoft',6,1,'FALSE',1,'FALSE','FALSE',NULL,'2017-10-12 07:54:40','FALSE')
,(1,29,5,2,'Mobile Solutions Cell Phone Management','Mobile Solutions',2,8,'FALSE',1,'FALSE','FALSE',NULL,'2017-10-19 07:20:29','FALSE')
,(1,9,1,1,'PluralSight Web training - Annual License','Pluralsight',6,1,'FALSE',1,'TRUE','FALSE','Annual Fee','2018-10-19 14:19:52','FALSE')
,(1,29,2,5,'StoneRidge Managed Service - Block Hours','StoneRidge',2,8,'FALSE',1,'FALSE','FALSE',NULL,'2017-10-16 14:25:17','FALSE')
,(1,20,1,1,'Jims Monthly Meals with Team and Meetings',NULL,3,1,'FALSE',1,'TRUE','FALSE',NULL,'2017-10-19 10:18:56','FALSE')
,(1,4,1,1,'Dark Trace (or Similar) Behavioral Security Monitor','Dark Trace',2,2,'FALSE',1,'FALSE','FALSE',NULL,'2019-10-21 14:41:52','FALSE')
,(1,30,5,2,'All Company Audio/Video Gear, Mixer, Camera',NULL,1,1,'FALSE',1,'FALSE','FALSE',NULL,'2017-10-17 11:03:30','FALSE')
,(1,3,5,2,'Conference Room Updates','Tierney / Self',1,1,'TRUE',3,'FALSE','FALSE',NULL,'2019-10-01 08:25:41','FALSE')
,(1,29,5,2,'Tierney Brothers Conf Room Management','Tierney',6,8,'FALSE',1,'FALSE','FALSE',NULL,'2019-10-01 18:18:00','FALSE')
,(1,4,2,5,'Sharegate SharePoint File Management Tool','Sharegate',1,1,'FALSE',1,'FALSE','FALSE',NULL,'2017-10-17 15:37:12','FALSE')
,(1,35,5,2,'Add RFID Card Swipe to IT Service Desk Area','Pro-Watch',1,1,'TRUE',4,'FALSE','FALSE',NULL,'2018-10-01 15:26:26','FALSE')
,(1,9,2,5,'BA Training for 1 person','New Horizons',1,1,'FALSE',1,'FALSE','FALSE','Local training','2019-09-30 13:57:48','FALSE')
,(1,9,5,2,'Client Tech/O365 training for 1 person','New Horizon',1,1,'FALSE',1,'FALSE','FALSE',NULL,'2019-09-30 13:57:19','FALSE')
,(1,35,5,2,'SOW work for O365 Optimization/AD','Microsoft Partner',1,6,'TRUE',2,'FALSE','FALSE',NULL,'2018-10-18 10:58:58','FALSE')
,(1,30,5,2,'Small Supplies for Business Use (Benchstock)',NULL,3,1,'FALSE',1,'FALSE','FALSE',NULL,'2019-09-30 09:21:45','FALSE')
,(1,3,5,2,'Test Computers for Developer R&D','Lenovo',1,1,'TRUE',2,'FALSE','FALSE','Confirm Qty','2017-10-19 07:24:02','FALSE')
,(1,35,5,2,'Summer Interns - 1 HC total (2of2), 4 mos',NULL,3,5,'FALSE',1,'FALSE','FALSE',NULL,'2019-09-30 10:19:17','FALSE')
,(1,31,5,2,'Clientside Backup and Recovery','Cloud',2,1,'FALSE',1,'FALSE','FALSE','Moved to DC3.0 and Backup Solution ($175k)','2019-10-21 14:42:22','FALSE')
,(1,12,2,5,'AIIM Professional Membership - Danielle','AIIM',6,1,'FALSE',1,'TRUE','FALSE',NULL,'2017-10-20 10:28:26','FALSE')
,(1,12,2,5,'ARMA Professional Membership - Danielle','ARMA',6,1,'FALSE',1,'TRUE','FALSE',NULL,'2017-10-20 10:29:33','FALSE')
,(1,29,5,2,'Insight ServiceDesk Managed Service','Insight',2,8,'FALSE',1,'FALSE','FALSE',NULL,'2017-10-20 12:46:17','FALSE')
,(1,35,4,7,'Junior Project Manager (Chidi to FTE)',NULL,3,5,'FALSE',1,'FALSE','FALSE',NULL,'2019-09-30 10:19:10','FALSE')
,(1,35,5,2,'Jr. Network Engineer (Ivan 3.0)',NULL,3,5,'FALSE',1,'FALSE','FALSE',NULL,'2019-09-30 10:19:03','FALSE')
,(1,4,5,2,'Service Now - Cancelled!','ServiceNow',6,2,'FALSE',1,'FALSE','FALSE','Contract cancelled.  Investigate Capitalized Implimentation costs.','2017-10-20 12:58:17','FALSE')
,(1,28,2,5,'OnBase Maintenance - 1 yr','OnBase',6,3,'FALSE',1,'FALSE','FALSE',NULL,'2019-10-01 08:23:39','FALSE')
,(1,13,2,5,'Recuiting Payment for Shristi','Maritz',1,5,'FALSE',1,'FALSE','FALSE',NULL,'2018-09-27 14:09:09','FALSE')
,(1,35,4,7,'Conversion of Shami to FTE - $60k',NULL,3,5,'FALSE',1,'FALSE','FALSE',NULL,'2018-09-27 15:27:44','FALSE')
,(1,4,1,1,'E-Mail Scanner/Link Security Management','CheckPoint',6,2,'FALSE',1,'FALSE','FALSE',NULL,'2019-10-21 14:40:23','FALSE')
,(1,25,5,2,'SharePoint Backup for Discovery/Retention','Avepoint',4,2,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-18 10:56:20','FALSE')
,(1,25,5,2,'Deployment of Remote Control Field Servers','Dell',1,1,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-15 15:42:34','FALSE')
,(1,35,5,2,'Datacenter 3.0 - Backup System Replacement','Veeam or similar',1,1,'TRUE',3,'FALSE','FALSE',NULL,'2019-10-01 08:13:04','FALSE')
,(1,3,5,2,'Storage Switch','Cisco',1,1,'TRUE',4,'FALSE','FALSE',NULL,'2018-10-15 15:55:24','FALSE')
,(1,15,5,2,'Cell Phone Allocations','None',2,5,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-15 16:12:45','FALSE')
,(1,16,1,1,'Cell Allowances','None',2,5,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-15 16:28:35','FALSE')
,(1,16,4,7,'Cell Allowance','None',2,5,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-16 11:33:00','FALSE')
,(1,4,4,7,'PM Portfolio / Resource Management Subscription','Wrike',4,2,'FALSE',1,'FALSE','FALSE',NULL,'2019-12-23 09:06:09','FALSE')
,(1,35,5,2,'Convert Jerry (TX) to FTE','None',3,5,'FALSE',1,'FALSE','FALSE',NULL,'2019-09-30 10:17:14','FALSE')
,(1,35,2,5,'BI and Reporting Developer','None',3,5,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-16 13:11:20','FALSE')
,(1,12,4,7,'PMI Membership for Aradhana','PMI',6,1,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-16 13:36:26','FALSE')
,(1,27,5,2,'DC1 Nexis Core Switch Maintenance','OneNeck',6,4,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-16 14:16:06','FALSE')
,(1,27,5,2,'Catalyst 3650 WAN maintenance','Cisco',6,4,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-16 14:17:59','FALSE')
,(1,27,5,2,'Fabric Interconnects 6248 Maintenance','Cisco',6,4,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-16 14:20:15','FALSE')
,(1,27,5,2,'UCS Chassis Maintenance','Cisco',6,4,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-16 14:21:20','FALSE')
,(1,30,2,5,'iPad for Development Testing','Apple',1,1,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-18 10:03:45','FALSE')
,(1,5,2,5,'SharePoint Consultant - Brenda Backup (leave)','OnDemand',2,7,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-19 10:41:04','FALSE')
,(1,10,4,7,'Masters Degree Assistance - (Chidi)','St. Thomas',1,1,'FALSE',1,'FALSE','FALSE',NULL,'2019-10-03 08:35:37','FALSE')
,(1,19,2,5,'BTAD Office Visit',NULL,1,1,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-19 11:05:34','FALSE')
,(1,20,2,5,'BTAD Office Visit',NULL,1,1,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-19 11:08:57','FALSE')
,(1,18,2,5,'BTAD Office Visit',NULL,1,1,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-19 11:09:44','FALSE')
,(1,17,2,5,'BTAD Office Visit',NULL,1,1,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-19 11:10:20','FALSE')
,(1,9,2,5,'Workday Training Class (local)','Workday',1,1,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-23 14:06:19','FALSE')
,(1,29,5,2,'Advantix Invoice Servicing-both TEM and Utilities','Advantix',2,8,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-22 10:52:55','FALSE')
,(1,12,2,5,'AXUG Dynamics Communities Inc User Group','AXUG',6,1,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-22 10:54:43','FALSE')
,(1,30,5,2,'Monitors for Deployment - Distributed to business','Dell',3,1,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-22 10:59:48','FALSE')
,(1,30,5,2,'Docking Stations for New Laptops','Dell',3,1,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-22 11:01:41','FALSE')
,(1,4,5,2,'Asset Explorer Manageengine - 1 Year License','ZOHO',6,2,'FALSE',1,'FALSE','FALSE',NULL,'2019-09-20 10:21:47','FALSE')
,(1,14,2,5,'Employment Lawyer for Ravi Processing','Lawyers R Us',4,1,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-22 11:09:58','FALSE')
,(1,4,5,2,'Cirasync - Replacement for Commlink','cirasync',6,2,'FALSE',1,'FALSE','FALSE','https://cirasync.com/','2019-09-20 09:14:09','FALSE')
,(1,28,5,2,'Uniflow Printer Maintenance (3-year)','Marco Uniflow',6,3,'FALSE',1,'FALSE','FALSE','Unbudgetted for 2019 - Added once received the Invoice','2019-03-13 11:00:45','FALSE')
,(1,29,2,5,'DAX Platform Managed Service (Server hardware)','OneNeck',2,8,'FALSE',1,'FALSE','FALSE',NULL,'2019-09-18 16:44:34','FALSE')
,(1,29,2,5,'DAX Platform Managed Service (Application/SQL)','OneNeck',2,8,'FALSE',1,'FALSE','FALSE',NULL,'2019-09-18 16:44:41','FALSE')
,(1,4,5,2,'Manage Engine ITSM','ZOHO',6,2,'FALSE',1,'FALSE','FALSE',NULL,'2019-09-20 10:12:59','FALSE')
,(1,35,2,5,'Upgrade OnBase 2020','Kiriworks',1,6,'TRUE',2,'FALSE','FALSE',NULL,'2019-10-15 08:53:07','FALSE')
,(1,35,5,2,'Datacenter 3.0 - Servers','Various',1,9,'TRUE',2,'FALSE','FALSE',NULL,'2019-09-20 12:00:38','FALSE')
,(1,35,5,2,'Datacenter 3.0 - Nexus Primary Switch','Cisco',1,1,'TRUE',4,'FALSE','FALSE',NULL,'2019-09-20 14:46:41','FALSE')
,(1,35,5,2,'Datacenter 3.0 - Fabric for SAN (2)','Cisco',1,1,'TRUE',2,'FALSE','FALSE',NULL,'2019-09-20 14:48:19','FALSE')
,(1,35,5,2,'Datacenter 3.0 - Storage SAN (2)','Unk',1,1,'TRUE',3,'FALSE','FALSE',NULL,'2019-09-20 14:50:49','FALSE')
,(1,35,5,2,'Datacenter 3.0 - SQL Server Hardware','Cisco',1,1,'TRUE',2,'FALSE','FALSE',NULL,'2019-09-20 14:53:53','FALSE')
,(1,35,5,2,'Datacenter 3.0 - Pro Services','TBD',1,6,'TRUE',2,'FALSE','FALSE',NULL,'2019-09-20 14:54:55','FALSE')
,(1,35,2,5,'Data Warehouse - ETL Tool (Boomi or similar)','Dell',6,2,'FALSE',1,'FALSE','FALSE',NULL,'2019-09-20 15:56:18','FALSE')
,(1,3,5,2,'Meraki Routers for BIC Cloud','Cisco',1,1,'TRUE',4,'FALSE','FALSE',NULL,'2019-09-23 08:10:03','FALSE')
,(1,28,5,2,'Meraki Cloud Licensing','Cisco',6,2,'FALSE',1,'FALSE','FALSE',NULL,'2019-09-23 08:11:08','FALSE')
,(1,35,5,2,'FTE - Convert Will to Full Time (TX)',NULL,3,5,'FALSE',1,'FALSE','FALSE',NULL,'2019-09-30 10:18:10','FALSE')
,(1,35,4,7,'FTE - Barriers to Entry PM (start P5)','York',2,1,'FALSE',1,'FALSE','FALSE',NULL,'2019-09-30 10:21:12','FALSE')
,(1,35,5,2,'FTE - Boots on the Ground Tech Bloomington (Contract Convert)',NULL,3,5,'FALSE',1,'FALSE','FALSE',NULL,'2019-09-30 10:24:32','FALSE')
,(1,9,2,5,'PluralSight Web training - Enterprise Annual License','PluralSight',6,1,'FALSE',1,'FALSE','FALSE',NULL,'2019-10-03 14:27:01','FALSE')
,(1,31,5,2,'SCCM Gateway Service','MS Azure',2,2,'FALSE',1,'FALSE','FALSE',NULL,'2019-09-30 13:46:23','FALSE')
,(1,9,5,2,'PluralSight Web training - Enterprise Annual License','PluralSight',6,1,'FALSE',1,'FALSE','FALSE',NULL,'2019-10-03 14:27:19','FALSE')
,(1,30,5,2,'Loaner Video Projector','Sharp/InFocus',1,1,'FALSE',1,'FALSE','FALSE','Prvious projector went down to Arlington TX and was not returned.','2019-09-30 15:01:26','FALSE')
,(1,3,5,2,'Engineering Laptop/Desktop (Bryan Steger)','Dell',1,1,'TRUE',2,'FALSE','FALSE',NULL,'2019-09-30 15:03:22','FALSE')
,(1,29,1,1,'SOC Monitoring 24x7x365','TBD',2,8,'FALSE',1,'FALSE','FALSE',NULL,'2019-10-21 14:39:55','FALSE')
,(2,23,6,6,'Business Development Consulting Agency','Kiriworks',1,11,'FALSE',1,'FALSE','FALSE',NULL,'2021-01-18 00:00:00','FALSE')
,(2,6,6,7,'UX Training  (Level 1)','New Horizons',5,14,'FALSE',1,'FALSE','FALSE','Training of team','2021-01-18 00:00:00','FALSE')
,(2,9,6,7,'UX Training (Level 2)','New Horizons',5,14,'FALSE',1,'FALSE','FALSE','Training x 2','2021-01-18 00:00:00','FALSE')
,(2,20,7,6,'Dave Travel to North Dakota','National',1,10,'FALSE',1,'FALSE','FALSE','Lead Generation of new business opportunities','2021-01-18 00:00:00','FALSE')
,(1,4,5,2,'Knowbe4 Phishing Testing and Education','Knowbe4',6,1,'FALSE',1,'FALSE','FALSE',NULL,'2018-10-22 11:16:21','FALSE')
,(1,35,3,2,'F5 Load Balancers','F5',1,4,'TRUE',2,'FALSE','TRUE','Confirm Cap Life Recommendation','2021-01-24 00:00:00','FALSE')
,(1,26,5,2,'Nimble Storage Maintenance','Nimble',6,4,'FALSE',1,'FALSE','FALSE','Quoted at $21,510 on 12/20/20 payable 3/9/2021 for first chassis.','2021-01-24 00:00:00','FALSE')
,(1,26,5,2,'Horizon View, Production, SQL Blades Support','Cisco',6,4,'FALSE',1,'FALSE','TRUE','Confirm if still needed!','2021-01-24 00:00:00','FALSE')
,(2,7,7,8,'Local Confrance Fee (Ravi)','Local',1,14,'FALSE',1,'FALSE','FALSE','Conf. pre approved','2021-01-18 00:00:00','FALSE')
,(1,18,1,1,'Jim Office Visit to Dallas Area - 5 Days',NULL,1,1,'FALSE',1,'TRUE','FALSE',NULL,'2021-01-22 00:00:00','FALSE')
,(2,19,6,8,'Mark Travel to TX for office visit','Delta',1,10,'FALSE',1,'TRUE','FALSE','Travel to meet new leader - I am the boss','2021-01-22 00:00:00','FALSE')
,(1,35,5,2,'New RFID Door Server and Software','Pro-Tech',1,1,'TRUE',4,'FALSE','FALSE','Needed to allow for additional door locks.','2018-10-01 15:53:57','FALSE')
,(1,19,1,1,'Jim Office Visit to North Dakota -5 Days',NULL,1,1,'FALSE',1,'TRUE','FALSE',NULL,'2021-01-22 00:00:00','FALSE')
,(2,9,7,6,'Redgate Dynamic Page Builder Training','Redgate',2,10,'FALSE',1,'FALSE','FALSE','Monthly Training - Not yet approved','2021-01-22 00:00:00','FALSE')
,(1,17,5,2,'All Company Meeting Assistance - Airfare','Delta',1,1,'FALSE',1,'TRUE','FALSE','Estimated two air flights - update pricing of flights','2021-01-24 00:00:00','FALSE')
,(1,3,2,5,'Developer Desktops / Computers x2','Dell',1,1,'TRUE',2,'FALSE','FALSE','Confirm Quantity','2018-10-18 10:01:38','FALSE');



-- --------------------
INSERT INTO "t_primary_expenditure" ("budget_fk", "period", "year", "amount", "expense_note", "archived") VALUES
 (59,9,2019,0,'Without Office 2016 add-on','FALSE')
,(62,12,2019,55250,'includes prorated vSphere','FALSE')
,(73,10,2019,1000,'autoinject','FALSE')
,(76,10,2019,23905,'autoinject','FALSE')
,(78,1,2019,1100,'autoinject','FALSE')
,(79,1,2019,1500,'autoinject','FALSE')
,(81,13,2019,15000,NULL,'FALSE')
,(31,2,2020,600,'Airfare','FALSE')
,(32,2,2020,450,'Rental Car','FALSE')
,(34,4,2020,650,'Airfare','FALSE')
,(34,10,2020,650,'Airfare','FALSE')
,(35,4,2020,400,'3 nights','FALSE')
,(35,10,2020,400,'3 nights','FALSE')
,(36,9,2020,1650,NULL,'FALSE')
,(37,9,2020,1200,'5 people','FALSE')
,(38,9,2020,750,'Meals x 5 people','FALSE')
,(39,9,2020,350,'Hotel 3 Nights','FALSE')
,(40,10,2020,250,'Food for Jim plus others','FALSE')
,(41,9,2020,600,'Airfare','FALSE')
,(42,9,2020,600,'Hotel Stay','FALSE')
,(43,9,2020,400,'Rental Car','FALSE')
,(45,3,2020,650,'5 days','FALSE')
,(46,3,2020,600,'1 person','FALSE')
,(55,5,2020,2500,'1 training class','FALSE')
,(56,3,2020,600,'Spring Event (Team Yoga)','FALSE')
,(56,11,2020,600,'Fall Event (lawn bowling)','FALSE')
,(57,9,2020,11780,'As per 2017 Renewal','FALSE')
,(59,9,2020,0,'With Office 2016 add-on','FALSE')
,(62,12,2020,62500,'VMWare + Full year of vSphere','FALSE')
,(63,10,2020,0,'combined w/ other vmware','FALSE')
,(65,13,2020,4000,NULL,'FALSE')
,(66,1,2020,4000,'autoinject','FALSE')
,(66,2,2020,4000,'autoinject','FALSE')
,(66,3,2020,4000,'autoinject','FALSE')
,(66,4,2020,4000,'autoinject','FALSE')
,(66,5,2020,4000,'autoinject','FALSE')
,(66,6,2020,4000,'autoinject','FALSE')
,(66,7,2020,4000,'autoinject','FALSE')
,(66,8,2020,4000,'autoinject','FALSE')
,(66,9,2020,4000,'autoinject','FALSE')
,(66,10,2020,4000,'autoinject','FALSE')
,(66,12,2020,4000,'autoinject','FALSE')
,(66,13,2020,4000,'autoinject','FALSE')
,(67,4,2020,5600,'1 user','FALSE')
,(68,5,2020,1800,'no longer used','FALSE')
,(69,2,2020,13000,'(under budget was $14128)','FALSE')
,(70,1,2020,3000,'Estimated','FALSE')
,(71,3,2020,9000,'Quotes from Protech','FALSE')
,(73,10,2020,1000,'autoinject','FALSE')
,(75,1,2020,400,'autoinject','FALSE')
,(76,10,2020,24000,'autoinject','FALSE')
,(77,3,2020,31500,NULL,'FALSE')
,(78,1,2020,1100,'autoinject','FALSE')
,(79,1,2020,1500,'autoinject','FALSE')
,(80,1,2020,750,NULL,'FALSE')
,(82,1,2020,890,NULL,'FALSE')
,(84,1,2020,65000,'New Purchase','FALSE')
,(86,4,2020,3500,'SWAG','FALSE')
,(87,1,2020,1090,NULL,'FALSE')
,(88,1,2020,6220,NULL,'FALSE')
,(90,5,2020,1000,'autoinject','FALSE')
,(90,7,2020,1000,'autoinject','FALSE')
,(90,9,2020,1000,'autoinject','FALSE')
,(90,11,2020,1000,'autoinject','FALSE')
,(90,13,2020,1000,'autoinject','FALSE')
,(92,1,2020,24000,'autoinject','FALSE')
,(92,2,2020,24000,'autoinject','FALSE')
,(92,3,2020,24000,'autoinject','FALSE')
,(92,4,2020,24000,'autoinject','FALSE')
,(92,5,2020,24000,'autoinject','FALSE')
,(92,6,2020,24000,'autoinject','FALSE')
,(92,7,2020,24000,'autoinject','FALSE')
,(92,8,2020,24000,'autoinject','FALSE')
,(92,9,2020,24000,'autoinject','FALSE')
,(92,10,2020,24000,'autoinject','FALSE')
,(92,11,2020,24000,'autoinject','FALSE')
,(92,12,2020,24000,'autoinject','FALSE')
,(92,13,2020,24000,'autoinject','FALSE')
,(93,3,2020,35000,'Not Used','FALSE')
,(95,6,2020,35000,'Estimate','FALSE')
,(96,1,2020,50,'autoinject','FALSE')
,(96,2,2020,50,'autoinject','FALSE')
,(96,3,2020,50,'autoinject','FALSE')
,(96,4,2020,50,'autoinject - 1','FALSE')
,(96,5,2020,50,'autoinject','FALSE')
,(96,6,2020,50,'autoinject','FALSE')
,(96,7,2020,50,'autoinject','FALSE')
,(96,8,2020,50,'autoinject','FALSE')
,(96,9,2020,50,'autoinject','FALSE')
,(96,10,2020,50,'autoinject','FALSE')
,(96,11,2020,50,'autoinject','FALSE')
,(96,12,2020,50,'autoinject','FALSE')
,(96,13,2020,50,'autoinject','FALSE')
,(97,3,2020,7500,NULL,'FALSE')
,(97,10,2020,7500,NULL,'FALSE')
,(98,2,2020,8000,NULL,'FALSE')
,(99,3,2020,9231,'autoinject','FALSE')
,(99,4,2020,9231,'autoinject','FALSE')
,(99,5,2020,9231,'autoinject','FALSE')
,(99,6,2020,9231,'autoinject','FALSE')
,(99,7,2020,9231,'autoinject','FALSE')
,(99,8,2020,9231,'autoinject','FALSE')
,(99,9,2020,9231,'autoinject','FALSE')
,(99,10,2020,9231,'autoinject','FALSE')
,(99,11,2020,9231,'autoinject','FALSE')
,(99,12,2020,9231,'autoinject','FALSE')
,(99,13,2020,9231,'autoinject','FALSE')
,(100,5,2020,16000,'autoinject','FALSE')
,(100,6,2020,16000,'autoinject','FALSE')
,(100,7,2020,16000,'autoinject','FALSE')
,(100,8,2020,16000,'autoinject','FALSE')
,(100,9,2020,16000,'autoinject','FALSE')
,(101,4,2020,6154,'autoinject','FALSE')
,(101,5,2020,6154,'autoinject','FALSE')
,(101,6,2020,6154,'autoinject','FALSE')
,(101,7,2020,6154,'autoinject','FALSE')
,(14,8,2021,600,'Big Meals in Orlando','FALSE')
,(55,5,2020,450,'autoinject','FALSE')
,(55,7,2020,450,'autoinject','FALSE')
,(13,8,2021,450,'5 day rental','FALSE')
,(101,8,2020,6154,'autoinject','FALSE')
,(101,9,2020,6154,'autoinject','FALSE')
,(101,10,2020,6154,'autoinject','FALSE')
,(101,11,2020,6154,'autoinject','FALSE')
,(101,12,2020,6154,'autoinject','FALSE')
,(101,13,2020,6154,'Not Done','FALSE')
,(102,1,2020,5385,'autoinject','FALSE')
,(102,2,2020,5385,'autoinject','FALSE')
,(102,3,2020,5385,'autoinject','FALSE')
,(89,6,2021,2350,'Mary','FALSE')
,(89,2,2021,2350,'John','FALSE')
,(102,4,2020,5385,'autoinject','FALSE')
,(102,5,2020,5385,'autoinject','FALSE')
,(102,6,2020,5385,'autoinject','FALSE')
,(102,7,2020,5385,'autoinject','FALSE')
,(102,8,2020,5385,'autoinject','FALSE')
,(102,9,2020,5385,'autoinject','FALSE')
,(102,10,2020,5385,'autoinject','FALSE')
,(102,11,2020,5385,'autoinject','FALSE')
,(102,12,2020,5385,'autoinject','FALSE')
,(102,13,2020,5385,'autoinject','FALSE')
,(103,6,2020,2080,'For 1 HC','FALSE')
,(103,7,2020,2080,'For 1 HC','FALSE')
,(103,8,2020,2080,'For 1 HC','FALSE')
,(104,4,2020,250000,'Did not happen','FALSE')
,(105,1,2020,90000,'Did not happen','FALSE')
,(106,4,2020,85000,NULL,'FALSE')
,(108,1,2020,1154,'autoinject','FALSE')
,(108,2,2020,1154,'autoinject','FALSE')
,(108,3,2020,1154,'autoinject','FALSE')
,(108,4,2020,1154,'autoinject','FALSE')
,(108,5,2020,1154,'autoinject','FALSE')
,(108,6,2020,1154,'autoinject','FALSE')
,(108,7,2020,1154,'autoinject','FALSE')
,(108,8,2020,1154,'autoinject','FALSE')
,(108,9,2020,1154,'autoinject','FALSE')
,(108,10,2020,1154,'autoinject','FALSE')
,(108,11,2020,1154,'autoinject','FALSE')
,(108,12,2020,1154,'autoinject','FALSE')
,(108,13,2020,1154,'autoinject','FALSE')
,(110,3,2020,18000,'SOW Work','FALSE')
,(112,3,2020,12800,NULL,'FALSE')
,(112,4,2020,12800,NULL,'FALSE')
,(112,5,2020,12800,NULL,'FALSE')
,(112,5,2020,12800,NULL,'FALSE')
,(112,5,2020,12800,NULL,'FALSE')
,(113,1,2020,28000,NULL,'FALSE')
,(114,1,2020,16900,'autoinject','FALSE')
,(114,2,2020,16900,'autoinject','FALSE')
,(114,3,2020,16900,'autoinject','FALSE')
,(114,4,2020,16900,'autoinject','FALSE')
,(114,5,2020,16900,'autoinject','FALSE')
,(114,6,2020,16900,'autoinject','FALSE')
,(114,7,2020,16900,'autoinject','FALSE')
,(114,8,2020,16900,'autoinject','FALSE')
,(114,9,2020,16900,'autoinject','FALSE')
,(114,10,2020,16900,'autoinject','FALSE')
,(114,12,2020,16900,'autoinject','FALSE')
,(114,13,2020,16900,'autoinject','FALSE')
,(115,1,2020,2200,'autoinject','FALSE')
,(115,2,2020,2200,'autoinject','FALSE')
,(115,3,2020,2200,'autoinject','FALSE')
,(115,4,2020,2200,'autoinject','FALSE')
,(115,5,2020,2200,'autoinject','FALSE')
,(115,6,2020,2200,'autoinject','FALSE')
,(115,7,2020,2200,'autoinject','FALSE')
,(115,8,2020,2200,'autoinject','FALSE')
,(115,9,2020,2200,'autoinject','FALSE')
,(115,10,2020,2200,'autoinject','FALSE')
,(115,12,2020,2200,'autoinject','FALSE')
,(115,13,2020,2200,'autoinject','FALSE')
,(116,1,2020,2000,'autoinject','FALSE')
,(116,2,2020,2000,'autoinject','FALSE')
,(116,3,2020,2000,'autoinject','FALSE')
,(116,4,2020,2000,'autoinject','FALSE')
,(116,5,2020,2000,'autoinject','FALSE')
,(116,6,2020,2000,'autoinject','FALSE')
,(116,7,2020,2000,'autoinject','FALSE')
,(116,8,2020,2000,'autoinject','FALSE')
,(116,9,2020,2000,'autoinject','FALSE')
,(116,10,2020,2000,'autoinject','FALSE')
,(116,12,2020,2000,'autoinject','FALSE')
,(116,13,2020,2000,'autoinject','FALSE')
,(117,1,2020,800,'autoinject','FALSE')
,(117,2,2020,800,'autoinject','FALSE')
,(117,3,2020,800,'autoinject','FALSE')
,(117,4,2020,800,'autoinject','FALSE')
,(117,5,2020,800,'autoinject','FALSE')
,(117,6,2020,800,'autoinject','FALSE')
,(117,7,2020,800,'autoinject','FALSE')
,(117,8,2020,800,'autoinject','FALSE')
,(117,9,2020,800,'autoinject','FALSE')
,(117,10,2020,800,'autoinject','FALSE')
,(117,12,2020,800,'autoinject','FALSE')
,(117,13,2020,800,'autoinject','FALSE')
,(118,1,2020,3000,'autoinject','FALSE')
,(118,2,2020,3000,'autoinject','FALSE')
,(118,3,2020,3000,'autoinject','FALSE')
,(118,4,2020,3000,'autoinject','FALSE')
,(118,5,2020,3000,'autoinject','FALSE')
,(118,6,2020,3000,'autoinject','FALSE')
,(118,7,2020,3000,'autoinject','FALSE')
,(118,8,2020,3000,'autoinject','FALSE')
,(118,9,2020,3000,'autoinject','FALSE')
,(118,10,2020,3000,'autoinject','FALSE')
,(118,12,2020,3000,'autoinject','FALSE')
,(118,13,2020,3000,'autoinject','FALSE')
,(119,13,2020,0,'Part of EA','FALSE')
,(121,1,2020,600,'300x2 users','FALSE')
,(122,1,2020,700,'autoinject','FALSE')
,(122,2,2020,700,'autoinject','FALSE')
,(122,3,2020,700,'autoinject','FALSE')
,(122,4,2020,700,'autoinject','FALSE')
,(122,5,2020,700,'autoinject','FALSE')
,(122,6,2020,700,'autoinject','FALSE')
,(122,7,2020,700,'autoinject','FALSE')
,(122,8,2020,700,'autoinject','FALSE')
,(122,9,2020,700,'autoinject','FALSE')
,(122,10,2020,700,'autoinject','FALSE')
,(122,11,2020,700,'autoinject','FALSE')
,(122,12,2020,700,'autoinject','FALSE')
,(122,13,2020,700,'autoinject','FALSE')
,(120,6,2021,65000,'Secondary','FALSE')
,(120,4,2021,65000,'Primary','FALSE')
,(123,5,2020,8900,'Maintenance','FALSE')
,(123,5,2019,8750,'Maintenance','FALSE')
,(123,5,2018,8750,'Maintenance','FALSE')
,(123,5,2021,8900,'year 4 ?','FALSE')
,(123,5,2022,9000,NULL,'FALSE')
,(125,2,2020,3000,'Sum of small parts','FALSE')
,(126,6,2020,18000,'Based on prior Quotes','FALSE')
,(127,1,2020,5000,NULL,'FALSE')
,(128,1,2020,3995,NULL,'FALSE')
,(130,3,2020,6000,NULL,'FALSE')
,(131,7,2020,2500,NULL,'FALSE')
,(132,3,2020,2500,NULL,'FALSE')
,(133,8,2020,20000,NULL,'FALSE')
,(134,1,2020,2000,'autoinject','FALSE')
,(134,2,2020,2000,'autoinject','FALSE')
,(134,3,2020,2000,'autoinject','FALSE')
,(134,4,2020,2000,'autoinject','FALSE')
,(134,5,2020,2000,'autoinject','FALSE')
,(134,6,2020,2000,'autoinject','FALSE')
,(134,7,2020,2000,'autoinject','FALSE')
,(134,8,2020,2000,'autoinject','FALSE')
,(134,9,2020,2000,'autoinject','FALSE')
,(134,10,2020,2000,'autoinject','FALSE')
,(134,11,2020,2000,'autoinject','FALSE')
,(134,12,2020,2000,'autoinject','FALSE')
,(134,13,2020,2000,'autoinject','FALSE')
,(135,2,2020,4000,'Did not happen','FALSE')
,(135,9,2020,4000,'Did not happen','FALSE')
,(136,2,2020,2500,'autoinject','FALSE')
,(136,5,2020,2500,'autoinject','FALSE')
,(136,9,2020,2500,'autoinject','FALSE')
,(136,12,2020,2500,'autoinject','FALSE')
,(137,6,2020,2080,'For 1 HC','FALSE')
,(137,7,2020,2080,'For 1 HC','FALSE')
,(137,8,2020,2080,'For 1 HC','FALSE')
,(138,1,2020,308,'autoinject','FALSE')
,(138,2,2020,308,'autoinject','FALSE')
,(138,3,2020,308,'autoinject','FALSE')
,(138,4,2020,308,'autoinject','FALSE')
,(138,5,2020,308,'autoinject','FALSE')
,(138,6,2020,308,'autoinject','FALSE')
,(138,7,2020,308,'autoinject','FALSE')
,(138,8,2020,308,'autoinject','FALSE')
,(138,9,2020,308,'autoinject','FALSE')
,(138,10,2020,308,'autoinject','FALSE')
,(138,11,2020,308,'autoinject','FALSE')
,(138,12,2020,308,'autoinject','FALSE')
,(138,13,2020,308,'autoinject','FALSE')
,(139,11,2020,130,'Danielle','FALSE')
,(140,1,2020,175,'Danielle','FALSE')
,(141,1,2020,16950,'autoinject','FALSE')
,(141,2,2020,16950,'autoinject','FALSE')
,(141,3,2020,16950,'autoinject','FALSE')
,(141,4,2020,16550,'autoinject','FALSE')
,(141,5,2020,16550,'autoinject','FALSE')
,(141,6,2020,16550,'autoinject','FALSE')
,(141,7,2020,15950,'autoinject','FALSE')
,(141,8,2020,15950,'autoinject','FALSE')
,(141,9,2020,15950,'autoinject','FALSE')
,(141,10,2020,15950,'autoinject','FALSE')
,(141,11,2020,15950,'autoinject','FALSE')
,(141,12,2020,15950,'autoinject','FALSE')
,(141,13,2020,15700,'autoinject','FALSE')
,(142,3,2020,5000,'autoinject','FALSE')
,(142,4,2020,5000,'autoinject','FALSE')
,(142,5,2020,5000,'autoinject','FALSE')
,(142,6,2020,5000,'autoinject','FALSE')
,(142,7,2020,5000,'autoinject','FALSE')
,(142,8,2020,5000,'autoinject','FALSE')
,(142,9,2020,5000,'autoinject','FALSE')
,(142,10,2020,5000,'autoinject','FALSE')
,(142,11,2020,5000,'autoinject','FALSE')
,(142,12,2020,5000,'autoinject','FALSE')
,(142,13,2020,5000,'autoinject','FALSE')
,(143,3,2020,5000,'autoinject','FALSE')
,(143,4,2020,5000,'autoinject','FALSE')
,(143,5,2020,5000,'autoinject','FALSE')
,(143,6,2020,5000,'autoinject','FALSE')
,(143,7,2020,5000,'autoinject','FALSE')
,(143,8,2020,5000,'autoinject','FALSE')
,(143,9,2020,5000,'autoinject','FALSE')
,(143,10,2020,5000,'autoinject','FALSE')
,(143,11,2020,5000,'autoinject','FALSE')
,(143,12,2020,5000,'autoinject','FALSE')
,(143,13,2020,5000,'autoinject','FALSE')
,(144,1,2020,0,'Zero - Cancelled','FALSE')
,(145,1,2020,0,'Zero - Cancelled.','FALSE')
,(147,10,2020,6250,'1 of 2','FALSE')
,(147,12,2020,6250,'2 of 2','FALSE')
,(29,1,2021,2018,'autoinject','FALSE')
,(29,2,2021,2018,'autoinject','FALSE')
,(29,3,2021,2018,'autoinject','FALSE')
,(29,4,2021,2018,'autoinject','FALSE')
,(29,5,2021,2018,'autoinject','FALSE')
,(29,6,2021,2018,'autoinject','FALSE')
,(29,7,2021,201907,'Jim','FALSE')
,(31,2,2021,600,'Airfare','FALSE')
,(31,9,2021,600,'Airfare','FALSE')
,(32,2,2021,450,'Rental Car','FALSE')
,(32,9,2021,450,'Rental Car','FALSE')
,(55,1,2021,450,'autoinject','FALSE')
,(34,4,2021,650,'Airfare','FALSE')
,(34,10,2021,650,'Airfare','FALSE')
,(35,4,2021,400,'Hotel','FALSE')
,(35,10,2021,400,'Hotel','FALSE')
,(36,9,2021,1650,NULL,'FALSE')
,(37,9,2021,1200,'5 people','FALSE')
,(38,9,2021,750,'Meals x 5 people','FALSE')
,(39,9,2021,350,'Hotel 3 nights','FALSE')
,(40,9,2021,250,'Food for Jim +','FALSE')
,(41,10,2021,600,'Airfare','FALSE')
,(42,10,2021,600,NULL,'FALSE')
,(43,10,2021,400,'Rental Car','FALSE')
,(44,4,2021,200,NULL,'FALSE')
,(50,4,2021,750,NULL,'FALSE')
,(51,4,2021,600,'3 nights','FALSE')
,(52,4,2021,300,'Conf Meals','FALSE')
,(53,4,2021,350,'Conf Rental Car','FALSE')
,(54,4,2021,1000,'Conf  Fee','FALSE')
,(55,4,2021,3500,'1 Training Class','FALSE')
,(56,3,2021,600,'Spring Event (team yoga)','FALSE')
,(56,11,2021,600,'Fall Event (lawn bowling)','FALSE')
,(57,9,2021,13500,'updated 10/18/18','FALSE')
,(62,12,2021,70000,'Updated 10/18/18','FALSE')
,(124,3,2020,52800,'autoinject','FALSE')
,(124,3,2022,53000,'autoinject','FALSE')
,(124,3,2021,52900,'autoinject','FALSE')
,(65,13,2021,5000,'2018 Rate (3 Headcount)','FALSE')
,(65,13,2021,1750,'Up 1 License','FALSE')
,(66,1,2021,4000,'autoinject','FALSE')
,(66,2,2021,4000,'autoinject','FALSE')
,(66,3,2021,4000,'autoinject','FALSE')
,(66,4,2021,4000,'autoinject','FALSE')
,(66,5,2021,4000,'autoinject','FALSE')
,(66,6,2021,4000,'autoinject','FALSE')
,(66,7,2021,4000,'autoinject','FALSE')
,(66,8,2021,4000,'autoinject','FALSE')
,(66,9,2021,4000,'autoinject','FALSE')
,(66,10,2021,4000,'autoinject','FALSE')
,(66,12,2021,4000,'autoinject','FALSE')
,(66,13,2021,4000,'autoinject','FALSE')
,(69,2,2021,15500,'Adjusted 10/22/18','FALSE')
,(70,1,2021,3000,'autoinject','FALSE')
,(71,3,2021,9000,'Quotes from Protech','FALSE')
,(73,10,2021,1000,'autoinject','FALSE')
,(75,1,2021,400,'autoinject','FALSE')
,(76,10,2021,24000,'Updated 10/22/18','FALSE')
,(77,6,2021,25000,'Changed to $25k (removed Units)','FALSE')
,(78,1,2021,1100,'autoinject','FALSE')
,(79,1,2021,1500,'autoinject','FALSE')
,(80,1,2021,750,NULL,'FALSE')
,(82,1,2021,890,NULL,'FALSE')
,(86,4,2021,3500,'SWAG','FALSE')
,(87,1,2021,1090,NULL,'FALSE')
,(88,1,2021,6220,NULL,'FALSE')
,(90,1,2021,1000,'autoinject','FALSE')
,(90,3,2021,1000,'autoinject','FALSE')
,(90,5,2021,1000,'autoinject','FALSE')
,(90,7,2021,1000,'autoinject','FALSE')
,(90,9,2021,1000,'autoinject','FALSE')
,(90,11,2021,1000,'autoinject','FALSE')
,(90,13,2021,1000,'autoinject','FALSE')
,(92,1,2021,24000,'autoinject','FALSE')
,(92,2,2021,24000,'autoinject','FALSE')
,(92,3,2021,24000,'autoinject','FALSE')
,(92,4,2021,24000,'autoinject','FALSE')
,(92,5,2021,24000,'autoinject','FALSE')
,(92,6,2021,24000,'autoinject','FALSE')
,(92,7,2021,24000,'autoinject','FALSE')
,(92,8,2021,24000,'autoinject','FALSE')
,(92,9,2021,24000,'autoinject','FALSE')
,(92,10,2021,24000,'autoinject','FALSE')
,(92,11,2021,24000,'autoinject','FALSE')
,(92,12,2021,24000,'autoinject','FALSE')
,(92,13,2021,24000,'autoinject','FALSE')
,(93,5,2021,5500,'autoinject','FALSE')
,(93,6,2021,5500,'autoinject','FALSE')
,(93,7,2021,5500,'autoinject','FALSE')
,(93,8,2021,5500,'autoinject','FALSE')
,(93,9,2021,5500,'autoinject','FALSE')
,(93,10,2021,5500,'autoinject','FALSE')
,(93,12,2021,5500,'autoinject','FALSE')
,(93,13,2021,5500,NULL,'FALSE')
,(96,1,2021,50,'autoinject','FALSE')
,(96,2,2021,50,'autoinject','FALSE')
,(96,3,2021,50,'autoinject','FALSE')
,(96,4,2021,50,'autoinject','FALSE')
,(96,5,2021,50,'autoinject','FALSE')
,(96,6,2021,50,'autoinject','FALSE')
,(96,7,2021,50,'autoinject','FALSE')
,(96,8,2021,50,'autoinject','FALSE')
,(96,9,2021,50,'autoinject','FALSE')
,(96,10,2021,50,'autoinject','FALSE')
,(96,11,2021,50,'autoinject','FALSE')
,(96,12,2021,50,'autoinject','FALSE')
,(96,13,2021,50,'autoinject','FALSE')
,(97,5,2021,35000,'1 instance','FALSE')
,(99,7,2021,9231,'autoinject','FALSE')
,(99,8,2021,9231,'autoinject','FALSE')
,(99,9,2021,9231,'autoinject','FALSE')
,(99,10,2021,9231,'autoinject','FALSE')
,(99,11,2021,9231,'autoinject','FALSE')
,(99,12,2021,9231,'autoinject','FALSE')
,(99,13,2021,9231,'autoinject','FALSE')
,(100,5,2021,16000,'100hr x 160','FALSE')
,(100,6,2021,16000,'100hr x 160','FALSE')
,(100,7,2021,16000,'100hr x 160','FALSE')
,(100,8,2021,16000,'100hr x 160','FALSE')
,(100,9,2021,16000,'100hr x 160','FALSE')
,(101,13,2021,6153,'80K Annual','FALSE')
,(103,6,2021,2480,'For 1 HC - $15.50 hr','FALSE')
,(103,7,2021,2480,'For 1 HC','FALSE')
,(103,8,2021,2480,'For 1 HC','FALSE')
,(103,9,2021,2480,'For 1 HC','FALSE')
,(104,1,2021,125000,'Start of Project','FALSE')
,(104,4,2021,125000,'End of project','FALSE')
,(104,12,2021,20000,'Discovery','FALSE')
,(105,4,2021,25000,'1 month Contractor','FALSE')
,(105,5,2021,25000,'1 month contractor','FALSE')
,(105,6,2021,25000,'1 month contractor','FALSE')
,(105,7,2021,25000,'1 month contractor','FALSE')
,(105,8,2021,25000,'1 month contractor','FALSE')
,(108,1,2021,1154,'autoinject','FALSE')
,(108,2,2021,1154,'autoinject','FALSE')
,(108,3,2021,1154,'autoinject','FALSE')
,(108,4,2021,1154,'autoinject','FALSE')
,(108,5,2021,1154,'autoinject','FALSE')
,(108,6,2021,1154,'autoinject','FALSE')
,(108,7,2021,1154,'autoinject','FALSE')
,(108,8,2021,1154,'autoinject','FALSE')
,(108,9,2021,1154,'autoinject','FALSE')
,(108,10,2021,1154,'autoinject','FALSE')
,(108,11,2021,1154,'autoinject','FALSE')
,(108,12,2021,1154,'autoinject','FALSE')
,(108,13,2021,1154,'autoinject','FALSE')
,(112,3,2021,19200,NULL,'FALSE')
,(112,4,2021,19200,NULL,'FALSE')
,(112,5,2021,19200,NULL,'FALSE')
,(112,6,2021,19200,NULL,'FALSE')
,(113,1,2021,28000,NULL,'FALSE')
,(114,1,2021,16900,'autoinject','FALSE')
,(114,2,2021,16900,'autoinject','FALSE')
,(114,3,2021,16900,'autoinject','FALSE')
,(114,4,2021,16900,'autoinject','FALSE')
,(114,5,2021,16900,'autoinject','FALSE')
,(114,6,2021,16900,'autoinject','FALSE')
,(114,7,2021,16900,'autoinject','FALSE')
,(114,8,2021,16900,'autoinject','FALSE')
,(114,9,2021,16900,'autoinject','FALSE')
,(114,10,2021,16900,'autoinject','FALSE')
,(114,12,2021,16900,'autoinject','FALSE')
,(114,13,2021,16900,'autoinject','FALSE')
,(115,1,2021,2200,'autoinject','FALSE')
,(115,2,2021,2200,'autoinject','FALSE')
,(115,3,2021,2200,'autoinject','FALSE')
,(115,4,2021,2200,'autoinject','FALSE')
,(115,5,2021,2200,'autoinject','FALSE')
,(115,6,2021,2200,'autoinject','FALSE')
,(115,7,2021,2200,'autoinject','FALSE')
,(115,8,2021,2200,'autoinject','FALSE')
,(115,9,2021,2200,'autoinject','FALSE')
,(115,10,2021,2200,'autoinject','FALSE')
,(115,12,2021,2200,'autoinject','FALSE')
,(115,13,2021,2200,'autoinject','FALSE')
,(116,1,2021,2000,'autoinject','FALSE')
,(116,2,2021,2000,'autoinject','FALSE')
,(116,3,2021,2000,'autoinject','FALSE')
,(116,4,2021,2000,'autoinject','FALSE')
,(116,5,2021,2000,'autoinject','FALSE')
,(116,6,2021,2000,'autoinject','FALSE')
,(116,7,2021,2000,'autoinject','FALSE')
,(116,8,2021,2000,'autoinject','FALSE')
,(116,9,2021,2000,'autoinject','FALSE')
,(116,10,2021,2000,'autoinject','FALSE')
,(116,12,2021,2000,'autoinject','FALSE')
,(116,13,2021,2000,'autoinject','FALSE')
,(117,1,2021,800,'autoinject','FALSE')
,(117,2,2021,800,'autoinject','FALSE')
,(117,3,2021,800,'autoinject','FALSE')
,(117,4,2021,800,'autoinject','FALSE')
,(117,5,2021,800,'autoinject','FALSE')
,(117,6,2021,800,'autoinject','FALSE')
,(117,7,2021,800,'autoinject','FALSE')
,(117,8,2021,800,'autoinject','FALSE')
,(117,9,2021,800,'autoinject','FALSE')
,(117,10,2021,800,'autoinject','FALSE')
,(117,12,2021,800,'autoinject','FALSE')
,(117,13,2021,800,'autoinject','FALSE')
,(118,1,2021,3000,'autoinject','FALSE')
,(118,2,2021,3000,'autoinject','FALSE')
,(118,3,2021,3000,'autoinject','FALSE')
,(118,4,2021,3000,'autoinject','FALSE')
,(118,5,2021,3000,'autoinject','FALSE')
,(118,6,2021,3000,'autoinject','FALSE')
,(118,7,2021,3000,'autoinject','FALSE')
,(118,8,2021,3000,'autoinject','FALSE')
,(118,9,2021,3000,'autoinject','FALSE')
,(118,10,2021,3000,'autoinject','FALSE')
,(118,12,2021,3000,'autoinject','FALSE')
,(118,13,2021,3000,'autoinject','FALSE')
,(121,1,2021,900,'$449 x 2 users','FALSE')
,(122,1,2021,700,'autoinject','FALSE')
,(122,2,2021,700,NULL,'FALSE')
,(122,3,2021,700,NULL,'FALSE')
,(122,4,2021,700,NULL,'FALSE')
,(122,5,2021,700,NULL,'FALSE')
,(122,6,2021,700,NULL,'FALSE')
,(122,7,2021,700,NULL,'FALSE')
,(122,8,2021,700,NULL,'FALSE')
,(122,9,2021,700,NULL,'FALSE')
,(122,10,2021,700,NULL,'FALSE')
,(122,12,2021,700,NULL,'FALSE')
,(122,13,2021,700,NULL,'FALSE')
,(127,1,2021,5000,NULL,'FALSE')
,(128,1,2021,3995,NULL,'FALSE')
,(130,2,2021,6000,NULL,'FALSE')
,(131,7,2021,3500,NULL,'FALSE')
,(132,3,2021,2500,NULL,'FALSE')
,(132,9,2021,2500,NULL,'FALSE')
,(133,5,2021,35000,'Assuming MS kick-in','FALSE')
,(134,1,2021,2000,'autoinject','FALSE')
,(134,2,2021,2000,'autoinject','FALSE')
,(134,3,2021,2000,'autoinject','FALSE')
,(134,4,2021,2000,'autoinject','FALSE')
,(134,5,2021,2000,'autoinject','FALSE')
,(134,6,2021,2000,'autoinject','FALSE')
,(134,7,2021,2000,'autoinject','FALSE')
,(134,8,2021,2000,'autoinject','FALSE')
,(134,9,2021,2000,'autoinject','FALSE')
,(134,10,2021,2000,'autoinject','FALSE')
,(134,12,2021,2000,'autoinject','FALSE')
,(134,13,2021,2000,'autoinject','FALSE')
,(135,2,2021,2500,NULL,'FALSE')
,(135,9,2021,2500,NULL,'FALSE')
,(136,2,2021,2500,'autoinject','FALSE')
,(136,5,2021,2500,'autoinject','FALSE')
,(136,9,2021,2500,'autoinject','FALSE')
,(136,12,2021,2500,'autoinject','FALSE')
,(137,6,2021,2480,'For 1 HC - $15.50 hr','FALSE')
,(137,7,2021,2480,'For 1 HC - $15.50 hr','FALSE')
,(137,8,2021,2480,'For 1 HC - $15.50 hr','FALSE')
,(137,9,2021,2480,'For 1 HC - $15.50 hr','FALSE')
,(139,11,2021,260,'Danielle','FALSE')
,(140,1,2021,175,'Danielle','FALSE')
,(141,1,2021,15700,'autoinject','FALSE')
,(141,2,2021,15700,'autoinject','FALSE')
,(141,3,2021,15700,'autoinject','FALSE')
,(141,4,2021,15700,'autoinject','FALSE')
,(141,5,2021,15700,'autoinject','FALSE')
,(141,6,2021,15700,'autoinject','FALSE')
,(141,7,2021,15700,'autoinject','FALSE')
,(141,8,2021,15700,'autoinject','FALSE')
,(141,9,2021,15700,'autoinject','FALSE')
,(141,10,2021,15700,'autoinject','FALSE')
,(141,12,2021,15700,'autoinject','FALSE')
,(141,13,2021,15700,'autoinject','FALSE')
,(143,1,2021,5769,'autoinject','FALSE')
,(143,2,2021,5769,'autoinject','FALSE')
,(143,3,2021,5769,'autoinject','FALSE')
,(143,4,2021,5769,'autoinject','FALSE')
,(143,5,2021,5769,'autoinject','FALSE')
,(143,6,2021,5769,'autoinject','FALSE')
,(143,7,2021,5769,'autoinject','FALSE')
,(143,8,2021,5769,'autoinject','FALSE')
,(143,9,2021,5769,'autoinject','FALSE')
,(143,10,2021,5769,'autoinject','FALSE')
,(143,11,2021,5769,'autoinject','FALSE')
,(143,12,2021,5769,'autoinject','FALSE')
,(143,13,2021,5769,'autoinject','FALSE')
,(148,2,2021,4462,'autoinject','FALSE')
,(148,3,2021,4462,'autoinject','FALSE')
,(148,4,2021,4462,'autoinject','FALSE')
,(148,5,2021,4462,'autoinject','FALSE')
,(148,6,2021,4462,'autoinject','FALSE')
,(148,7,2021,4462,'autoinject','FALSE')
,(148,8,2021,4462,'autoinject','FALSE')
,(148,9,2021,4462,'autoinject','FALSE')
,(148,10,2021,4462,'autoinject','FALSE')
,(148,11,2021,4462,'autoinject','FALSE')
,(148,12,2021,4462,'autoinject','FALSE')
,(148,13,2021,4462,'autoinject','FALSE')
,(149,4,2021,5500,NULL,'FALSE')
,(149,5,2021,5500,'autoinject','FALSE')
,(149,6,2021,5500,'autoinject','FALSE')
,(149,7,2021,5500,'autoinject','FALSE')
,(149,8,2021,5500,'autoinject','FALSE')
,(149,9,2021,5500,'autoinject','FALSE')
,(149,10,2021,5500,'autoinject','FALSE')
,(149,12,2021,5500,'autoinject','FALSE')
,(149,13,2021,5500,'autoinject','FALSE')
,(150,2,2021,60000,'$50 user per year','FALSE')
,(151,1,2021,3600,'3 Per Period','FALSE')
,(151,2,2021,3600,'3 Per Period','FALSE')
,(151,3,2021,3600,'3 Per Period','FALSE')
,(151,4,2021,3600,'3 Per Period','FALSE')
,(151,5,2021,3600,'3 Per Period','FALSE')
,(151,6,2021,3600,'3 Per Period','FALSE')
,(151,7,2021,3600,'3 Per Period','FALSE')
,(151,8,2021,3600,'3 Per Period','FALSE')
,(151,9,2021,3600,'3 Per Period','FALSE')
,(151,10,2021,3600,'3 Per Period','FALSE')
,(152,4,2021,125000,'Assuming Purchase','FALSE')
,(153,4,2021,10000,'purchase','FALSE')
,(154,1,2021,450,'Assuming 6 x $75','FALSE')
,(154,2,2021,450,'autoinject','FALSE')
,(154,3,2021,450,'autoinject','FALSE')
,(154,4,2021,450,'autoinject','FALSE')
,(154,5,2021,450,'autoinject','FALSE')
,(154,6,2021,450,'autoinject','FALSE')
,(154,7,2021,450,'autoinject','FALSE')
,(154,8,2021,450,'autoinject','FALSE')
,(154,9,2021,450,'autoinject','FALSE')
,(154,10,2021,450,'autoinject','FALSE')
,(154,11,2021,450,'autoinject','FALSE')
,(154,12,2021,450,'autoinject','FALSE')
,(154,13,2021,450,'autoinject','FALSE')
,(155,1,2021,175,'2 headcount','FALSE')
,(155,2,2021,175,'autoinject','FALSE')
,(155,3,2021,175,'autoinject','FALSE')
,(155,4,2021,175,'autoinject','FALSE')
,(155,5,2021,175,'autoinject','FALSE')
,(155,6,2021,175,'autoinject','FALSE')
,(155,7,2021,175,'autoinject','FALSE')
,(155,8,2021,175,'autoinject','FALSE')
,(155,9,2021,175,'autoinject','FALSE')
,(155,10,2021,175,'autoinject','FALSE')
,(155,11,2021,175,'autoinject','FALSE')
,(155,12,2021,175,'autoinject','FALSE')
,(155,13,2021,175,'autoinject','FALSE')
,(156,1,2021,75,'1 Headcount','FALSE')
,(156,2,2021,75,'autoinject','FALSE')
,(156,3,2021,75,'autoinject','FALSE')
,(156,4,2021,75,'autoinject','FALSE')
,(156,5,2021,75,'autoinject','FALSE')
,(156,6,2021,75,'autoinject','FALSE')
,(156,7,2021,75,'autoinject','FALSE')
,(156,8,2021,75,'autoinject','FALSE')
,(156,9,2021,75,'autoinject','FALSE')
,(156,10,2021,75,'autoinject','FALSE')
,(156,11,2021,75,'autoinject','FALSE')
,(156,12,2021,75,'autoinject','FALSE')
,(156,13,2021,75,'autoinject','FALSE')
,(157,12,2021,3000,'Initial Install','FALSE')
,(158,3,2021,4615,'autoinject','FALSE')
,(158,4,2021,4615,'autoinject','FALSE')
,(158,5,2021,4615,'autoinject','FALSE')
,(158,6,2021,4615,'autoinject','FALSE')
,(158,7,2021,4615,'autoinject','FALSE')
,(158,8,2021,4615,'autoinject','FALSE')
,(158,9,2021,4615,'autoinject','FALSE')
,(158,10,2021,4615,'autoinject','FALSE')
,(158,11,2021,4615,'autoinject','FALSE')
,(158,12,2021,4615,'autoinject','FALSE')
,(159,2,2021,6153,'autoinject','FALSE')
,(159,3,2021,6153,'autoinject','FALSE')
,(159,4,2021,6153,'autoinject','FALSE')
,(159,5,2021,6153,'autoinject','FALSE')
,(159,6,2021,6153,'autoinject','FALSE')
,(159,7,2021,6153,'autoinject','FALSE')
,(159,8,2021,6153,'autoinject','FALSE')
,(159,9,2021,6153,'autoinject','FALSE')
,(159,10,2021,6153,'autoinject','FALSE')
,(159,11,2021,6153,'autoinject','FALSE')
,(159,12,2021,6153,'$80k Assumed','FALSE')
,(162,3,2022,7500,'Still Required?','FALSE')
,(162,3,2021,7500,'Still Required?','FALSE')
,(164,3,2021,3600,'Based on $18k purchase','FALSE')
,(165,3,2021,3600,'Based on $18k Purchase','FALSE')
,(166,3,2021,45000,'Based on $225k Purchase','FALSE')
,(168,3,2021,700,'1 unit WiFi','FALSE')
,(169,4,2021,6600,'2 weeks 20hours each','FALSE')
,(169,5,2021,13200,'4 weeks 20 hours each','FALSE')
,(169,6,2021,6600,'2 weeks 20 hours each','FALSE')
,(169,7,2021,6600,'4 weeks 10 hours each','FALSE')
,(170,8,2021,5250,'Not yet approved','FALSE')
,(121,6,2021,450,'Office Visit Rental Car','FALSE')
,(122,6,2021,350,'Office Visit Meals','FALSE')
,(125,4,2021,2500,'1 Workday Class','FALSE')
,(125,8,2021,2500,'1 Workday Class','FALSE')
,(126,1,2021,4200,NULL,'FALSE')
,(126,2,2021,4200,NULL,'FALSE')
,(126,3,2021,4200,NULL,'FALSE')
,(126,4,2021,4200,NULL,'FALSE')
,(126,5,2021,4200,NULL,'FALSE')
,(126,6,2021,4200,NULL,'FALSE')
,(126,7,2021,4200,NULL,'FALSE')
,(126,8,2021,4200,NULL,'FALSE')
,(126,9,2021,4200,NULL,'FALSE')
,(126,10,2021,4200,NULL,'FALSE')
,(126,12,2021,4200,NULL,'FALSE')
,(126,13,2021,4200,NULL,'FALSE')
,(127,1,2021,1500,'1 year','FALSE')
,(128,1,2021,1000,'8 per period','FALSE')
,(128,2,2021,1000,'8 per period','FALSE')
,(128,3,2021,1000,'8 per period','FALSE')
,(128,4,2021,1000,'8 per period','FALSE')
,(128,5,2021,1000,'8 per period','FALSE')
,(128,6,2021,1000,'8 per period','FALSE')
,(128,7,2021,1000,'8 per period','FALSE')
,(128,8,2021,1000,'8 per period','FALSE')
,(128,9,2021,1000,'8 per period','FALSE')
,(128,10,2021,1000,'8 per period','FALSE')
,(128,11,2021,1000,'8 per period','FALSE')
,(128,12,2021,1000,'8 per period','FALSE')
,(128,13,2021,1000,'8 per period','FALSE')
,(129,1,2021,3000,'20 per per','FALSE')
,(129,2,2021,3000,'20 per per','FALSE')
,(129,3,2021,3000,'20 per per','FALSE')
,(129,4,2021,3000,'20 per per','FALSE')
,(129,5,2021,3000,'20 per per','FALSE')
,(129,6,2021,3000,'20 per per','FALSE')
,(129,7,2021,3000,'20 per per','FALSE')
,(129,8,2021,3000,'20 per per','FALSE')
,(129,9,2021,3000,'20 per per','FALSE')
,(129,10,2021,3000,'20 per per','FALSE')
,(129,11,2021,3000,'20 per per','FALSE')
,(129,12,2021,3000,'20 per per','FALSE')
,(129,13,2021,3000,'20 per per','FALSE')
,(130,6,2021,4500,'1 year','FALSE')
,(131,2,2021,2000,'Guess','FALSE')
,(131,5,2021,2000,'Guess','FALSE')
,(131,7,2021,2000,'Guess','FALSE')
,(132,6,2021,15000,'3-yr agreement','FALSE')
,(133,1,2021,14500,'Est','FALSE')
,(31,2,2022,600,'Airfare','FALSE')
,(31,9,2022,600,'Airfare','FALSE')
,(32,2,2022,450,'Rental Car','FALSE')
,(32,9,2022,450,'Rental Car','FALSE')
,(34,4,2022,650,'Airfare','FALSE')
,(34,10,2022,650,'Airfare','FALSE')
,(35,4,2022,400,'Hotel','FALSE')
,(35,10,2022,400,'Hotel','FALSE')
,(36,6,2022,1650,NULL,'FALSE')
,(37,6,2022,1200,'5 people','FALSE')
,(38,6,2022,750,'Meals x 5 people','FALSE')
,(39,9,2022,350,'Hotel 3 nights','FALSE')
,(40,9,2022,250,'Food for Jim +','FALSE')
,(41,10,2022,600,'Airfare','FALSE')
,(42,10,2022,600,NULL,'FALSE')
,(43,10,2022,400,'Rental Car','FALSE')
,(45,3,2022,650,'5 days','FALSE')
,(45,11,2022,650,'5 days','FALSE')
,(46,3,2022,600,'1 person','FALSE')
,(55,4,2022,3500,'1 Training Class','FALSE')
,(56,3,2022,600,'Spring Event (team yoga)','FALSE')
,(56,11,2022,600,'Fall Event (lawn bowling)','FALSE')
,(57,9,2022,12500,'updated 07/19 invoice','FALSE')
,(62,12,2022,71000,'updated 10/25/19','FALSE')
,(65,13,2022,6750,'4 headcount','FALSE')
,(69,2,2022,15500,NULL,'FALSE')
,(70,1,2022,3000,'autoinject','FALSE')
,(71,3,2022,9000,'Quotes from Protech','FALSE')
,(161,9,2021,1500,'Install Kit','FALSE')
,(163,3,2020,8500,'additional blade','FALSE')
,(73,10,2022,1000,'autoinject','FALSE')
,(75,1,2022,400,'autoinject','FALSE')
,(76,12,2022,32000,'Changed to Loffler','FALSE')
,(77,6,2022,0,'Stopped all Maintenance','FALSE')
,(78,1,2022,1100,'autoinject','FALSE')
,(79,1,2022,1500,'autoinject','FALSE')
,(80,1,2022,750,NULL,'FALSE')
,(82,1,2022,890,NULL,'FALSE')
,(86,4,2022,3500,'SWAG for BL1','FALSE')
,(87,1,2022,1090,NULL,'FALSE')
,(88,1,2022,6220,NULL,'FALSE')
,(92,1,2022,26000,NULL,'FALSE')
,(92,2,2022,26000,NULL,'FALSE')
,(92,3,2022,26000,NULL,'FALSE')
,(92,4,2022,26000,NULL,'FALSE')
,(92,5,2022,26000,NULL,'FALSE')
,(92,6,2022,26000,NULL,'FALSE')
,(92,7,2022,26000,NULL,'FALSE')
,(92,8,2022,26000,NULL,'FALSE')
,(92,9,2022,26000,NULL,'FALSE')
,(92,10,2022,26000,NULL,'FALSE')
,(31,10,2021,2600,'autoinject','FALSE')
,(28,5,2022,12200,'autoinject','FALSE')
,(92,11,2022,26000,NULL,'FALSE')
,(92,12,2022,26000,NULL,'FALSE')
,(92,13,2022,26000,NULL,'FALSE')
,(96,1,2022,50,'autoinject','FALSE')
,(96,2,2022,50,'autoinject','FALSE')
,(96,3,2022,50,'autoinject','FALSE')
,(96,4,2022,50,'autoinject','FALSE')
,(96,5,2022,50,'autoinject','FALSE')
,(96,6,2022,50,'autoinject','FALSE')
,(96,7,2022,50,'autoinject','FALSE')
,(96,8,2022,50,'autoinject','FALSE')
,(96,9,2022,50,'autoinject','FALSE')
,(96,10,2022,50,'autoinject','FALSE')
,(96,12,2022,50,'autoinject','FALSE')
,(96,13,2022,50,'autoinject','FALSE')
,(97,5,2022,35000,'1 Instance','FALSE')
,(101,1,2022,7310,'13 pers','FALSE')
,(101,2,2022,7310,'13 pers','FALSE')
,(101,3,2022,7310,'13 pers','FALSE')
,(101,4,2022,7310,'13 pers','FALSE')
,(101,5,2022,7310,'13 pers','FALSE')
,(101,6,2022,7310,'13 pers','FALSE')
,(101,7,2022,7310,'13 pers','FALSE')
,(101,8,2022,7310,'13 pers','FALSE')
,(101,9,2022,7310,'13 pers','FALSE')
,(101,10,2022,7310,'13 pers','FALSE')
,(101,12,2022,7310,'13 pers','FALSE')
,(101,13,2022,7310,'13 pers','FALSE')
,(104,1,2022,35000,'Tailwind','FALSE')
,(104,2,2022,35000,'Tailwind','FALSE')
,(104,3,2022,35000,'Tailwind','FALSE')
,(104,4,2022,35000,'Tailwind','FALSE')
,(104,5,2022,35000,'Tailwind','FALSE')
,(104,6,2022,35000,'Tailwind','FALSE')
,(104,7,2022,35000,'Tailwind','FALSE')
,(104,8,2022,35000,'Tailwind','FALSE')
,(104,9,2022,35000,'Tailwind','FALSE')
,(104,10,2022,35000,'Tailwind','FALSE')
,(104,12,2022,35000,'Tailwind','FALSE')
,(104,13,2022,35000,'Tailwind','FALSE')
,(108,1,2022,1000,'autoinject','FALSE')
,(108,3,2022,1000,'autoinject','FALSE')
,(108,5,2022,1000,'autoinject','FALSE')
,(108,7,2022,1000,'autoinject','FALSE')
,(108,9,2022,1000,'autoinject','FALSE')
,(108,11,2022,1000,'autoinject','FALSE')
,(113,1,2022,28000,NULL,'FALSE')
,(114,1,2022,12060,'autoinject','FALSE')
,(114,2,2022,12060,'autoinject','FALSE')
,(114,3,2022,12060,'autoinject','FALSE')
,(114,4,2022,12060,'autoinject','FALSE')
,(114,5,2022,12060,'autoinject','FALSE')
,(114,6,2022,12060,'autoinject','FALSE')
,(114,7,2022,12060,'autoinject','FALSE')
,(114,8,2022,12060,'autoinject','FALSE')
,(114,9,2022,12060,'autoinject','FALSE')
,(114,10,2022,12060,'autoinject','FALSE')
,(114,12,2022,12060,'autoinject','FALSE')
,(114,13,2022,12060,'autoinject','FALSE')
,(115,1,2022,1920,'Per Contract','FALSE')
,(115,2,2022,1920,'Per Contract','FALSE')
,(115,3,2022,1920,'Per Contract','FALSE')
,(115,4,2022,1920,'Per Contract','FALSE')
,(115,5,2022,1920,'Per Contract','FALSE')
,(115,6,2022,1920,'Per Contract','FALSE')
,(115,7,2022,1920,'Per Contract','FALSE')
,(115,8,2022,1920,'Per Contract','FALSE')
,(115,9,2022,1920,'Per Contract','FALSE')
,(115,10,2022,1920,'Per Contract','FALSE')
,(115,12,2022,1920,'Per Contract','FALSE')
,(115,13,2022,1920,'Per Contract','FALSE')
,(116,1,2022,700,'autoinject','FALSE')
,(116,2,2022,700,'autoinject','FALSE')
,(116,3,2022,700,'autoinject','FALSE')
,(116,4,2022,700,'autoinject','FALSE')
,(116,5,2022,700,'autoinject','FALSE')
,(116,6,2022,700,'autoinject','FALSE')
,(116,7,2022,700,'autoinject','FALSE')
,(116,8,2022,700,'autoinject','FALSE')
,(116,9,2022,700,'autoinject','FALSE')
,(116,10,2022,700,'autoinject','FALSE')
,(116,12,2022,700,'autoinject','FALSE')
,(116,13,2022,700,'autoinject','FALSE')
,(117,1,2022,800,'autoinject','FALSE')
,(117,2,2022,800,'autoinject','FALSE')
,(117,3,2022,800,'autoinject','FALSE')
,(117,4,2022,800,'autoinject','FALSE')
,(117,5,2022,800,'autoinject','FALSE')
,(117,6,2022,800,'autoinject','FALSE')
,(117,7,2022,800,'autoinject','FALSE')
,(117,8,2022,800,'autoinject','FALSE')
,(117,9,2022,800,'autoinject','FALSE')
,(117,10,2022,800,'autoinject','FALSE')
,(117,12,2022,800,'autoinject','FALSE')
,(117,13,2022,800,'autoinject','FALSE')
,(118,1,2022,3000,'autoinject','FALSE')
,(118,2,2022,3000,'autoinject','FALSE')
,(118,3,2022,3000,'autoinject','FALSE')
,(118,4,2022,3000,'autoinject','FALSE')
,(118,5,2022,3000,'autoinject','FALSE')
,(118,6,2022,3000,'autoinject','FALSE')
,(118,7,2022,3000,'autoinject','FALSE')
,(118,8,2022,3000,'autoinject','FALSE')
,(118,9,2022,3000,'autoinject','FALSE')
,(118,10,2022,3000,'autoinject','FALSE')
,(118,12,2022,3000,'autoinject','FALSE')
,(118,13,2022,3000,'autoinject','FALSE')
,(121,1,2022,449,'$449 x 1 user','FALSE')
,(122,1,2022,700,'autoinject','FALSE')
,(122,2,2022,700,'autoinject','FALSE')
,(122,3,2022,700,'autoinject','FALSE')
,(122,4,2022,700,'autoinject','FALSE')
,(122,5,2022,700,'autoinject','FALSE')
,(122,6,2022,700,'autoinject','FALSE')
,(122,7,2022,700,'autoinject','FALSE')
,(122,8,2022,700,'autoinject','FALSE')
,(122,9,2022,700,'autoinject','FALSE')
,(122,10,2022,700,'autoinject','FALSE')
,(122,12,2022,700,'autoinject','FALSE')
,(122,13,2022,700,'autoinject','FALSE')
,(125,2,2022,3000,'All Company Parts','FALSE')
,(126,4,2022,15000,'BL1 Foundations +SOW','FALSE')
,(126,6,2022,6500,'BL1 x 3 small','FALSE')
,(128,1,2022,3995,NULL,'FALSE')
,(131,7,2022,3500,NULL,'FALSE')
,(132,3,2022,2500,NULL,'FALSE')
,(132,9,2022,2500,NULL,'FALSE')
,(134,1,2022,2200,'autoinject','FALSE')
,(134,2,2022,2200,'autoinject','FALSE')
,(134,3,2022,2200,'autoinject','FALSE')
,(134,4,2022,2200,'autoinject','FALSE')
,(134,5,2022,2200,'autoinject','FALSE')
,(134,6,2022,2200,'autoinject','FALSE')
,(134,7,2022,2200,'autoinject','FALSE')
,(134,8,2022,2200,'autoinject','FALSE')
,(134,9,2022,2200,'autoinject','FALSE')
,(134,10,2022,2200,'autoinject','FALSE')
,(134,11,2022,2200,'autoinject','FALSE')
,(134,12,2022,2200,'autoinject','FALSE')
,(134,13,2022,2200,'autoinject','FALSE')
,(135,2,2022,3000,NULL,'FALSE')
,(135,9,2022,3000,NULL,'FALSE')
,(136,2,2022,2500,'autoinject','FALSE')
,(136,5,2022,2500,'autoinject','FALSE')
,(136,9,2022,2500,'autoinject','FALSE')
,(136,12,2022,2500,'autoinject','FALSE')
,(137,6,2022,2480,'For 1 HC - $15.50 hr','FALSE')
,(137,7,2022,2480,'For 1 HC - $15.50 hr','FALSE')
,(137,8,2022,2480,'For 1 HC - $15.50 hr','FALSE')
,(137,9,2022,2480,'For 1 HC - $15.50 hr','FALSE')
,(141,1,2022,15500,'Monthly LWM','FALSE')
,(141,2,2022,15500,'Monthly LWM','FALSE')
,(141,3,2022,15500,'Monthly LWM','FALSE')
,(141,4,2022,15500,'Monthly LWM','FALSE')
,(141,5,2022,15500,'Monthly LWM','FALSE')
,(141,6,2022,15500,'Monthly LWM','FALSE')
,(141,7,2022,15500,'Monthly LWM','FALSE')
,(141,8,2022,15500,'Monthly LWM','FALSE')
,(141,9,2022,15500,'Monthly LWM','FALSE')
,(141,10,2022,15500,'Monthly LWM','FALSE')
,(141,12,2022,15500,'Monthly LWM','FALSE')
,(141,13,2022,15500,'Monthly LWM','FALSE')
,(145,9,2022,42000,'Based on 2019 renewal','FALSE')
,(151,1,2022,3600,'3 per period','FALSE')
,(151,2,2022,3600,'3 per period','FALSE')
,(151,3,2022,3600,'3 per period','FALSE')
,(151,4,2022,3600,'3 per period','FALSE')
,(151,5,2022,3600,'3 per period','FALSE')
,(151,6,2022,3600,'3 per period','FALSE')
,(151,7,2022,3600,'3 per period','FALSE')
,(151,8,2022,3600,'3 per period','FALSE')
,(151,9,2022,3600,'3 per period','FALSE')
,(151,10,2022,3600,'3 per period','FALSE')
,(151,11,2022,3600,'3 per period','FALSE')
,(151,12,2022,3600,'3 per period','FALSE')
,(151,13,2022,3600,'3 per period','FALSE')
,(152,4,2022,175000,'Assuming Purchase','FALSE')
,(154,1,2022,525,'7 phones','FALSE')
,(154,2,2022,525,'7 phones','FALSE')
,(154,3,2022,525,'7 phones','FALSE')
,(154,4,2022,525,'7 phones','FALSE')
,(154,5,2022,525,'7 phones','FALSE')
,(154,6,2022,525,'7 phones','FALSE')
,(154,7,2022,525,'7 phones','FALSE')
,(154,8,2022,525,'7 phones','FALSE')
,(154,9,2022,525,'7 phones','FALSE')
,(154,10,2022,525,'7 phones','FALSE')
,(154,12,2022,525,'7 phones','FALSE')
,(154,13,2022,525,'7 phones','FALSE')
,(155,1,2022,100,'1 Officer Cell Phone','FALSE')
,(155,2,2022,100,'1 Officer Cell Phone','FALSE')
,(155,3,2022,100,'1 Officer Cell Phone','FALSE')
,(155,4,2022,100,'1 Officer Cell Phone','FALSE')
,(155,5,2022,100,'1 Officer Cell Phone','FALSE')
,(155,6,2022,100,'1 Officer Cell Phone','FALSE')
,(155,7,2022,100,'1 Officer Cell Phone','FALSE')
,(155,8,2022,100,'1 Officer Cell Phone','FALSE')
,(155,9,2022,100,'1 Officer Cell Phone','FALSE')
,(155,10,2022,100,'1 Officer Cell Phone','FALSE')
,(155,12,2022,100,'1 Officer Cell Phone','FALSE')
,(155,13,2022,100,'1 Officer Cell Phone','FALSE')
,(156,1,2022,150,'2 cell phones','FALSE')
,(156,2,2022,150,'2 cell phones','FALSE')
,(156,3,2022,150,'2 cell phones','FALSE')
,(156,4,2022,150,'2 cell phones','FALSE')
,(156,5,2022,150,'2 cell phones','FALSE')
,(156,6,2022,150,'2 cell phones','FALSE')
,(156,7,2022,150,'2 cell phones','FALSE')
,(156,8,2022,150,'2 cell phones','FALSE')
,(156,9,2022,150,'2 cell phones','FALSE')
,(156,10,2022,150,'2 cell phones','FALSE')
,(156,12,2022,150,'2 cell phones','FALSE')
,(156,13,2022,150,'2 cell phones','FALSE')
,(157,2,2022,1000,'Quarterly Pmt','FALSE')
,(157,5,2022,1000,'Quarterly Pmt','FALSE')
,(157,9,2022,1000,'Quarterly Pmt','FALSE')
,(157,12,2022,1000,'Quarterly Pmt','FALSE')
,(157,3,2022,129,'1 yr membership','FALSE')
,(158,3,2022,2400,'Based on $12k Purchase','FALSE')
,(164,3,2022,3600,'Based on $18k purchase','FALSE')
,(165,3,2022,3600,'Based on $18k Purchase','FALSE')
,(166,3,2022,45000,'Based on $225k Purchase','FALSE')
,(168,3,2022,700,'1 unit WiFi','FALSE')
,(170,8,2022,5250,'Not yet approved','FALSE')
,(121,6,2022,450,'Office Visit Rental Car','FALSE')
,(122,6,2022,350,'Office Visit Meals','FALSE')
,(125,8,2022,2500,'1 Workday Class','FALSE')
,(126,1,2022,4200,NULL,'FALSE')
,(126,2,2022,4200,NULL,'FALSE')
,(126,3,2022,4200,NULL,'FALSE')
,(126,4,2022,4200,NULL,'FALSE')
,(126,5,2022,4200,NULL,'FALSE')
,(126,6,2022,4200,NULL,'FALSE')
,(126,7,2022,4200,NULL,'FALSE')
,(126,8,2022,4200,NULL,'FALSE')
,(163,3,2019,7500,'Increase cost','FALSE')
,(126,9,2022,4200,NULL,'FALSE')
,(126,10,2022,4200,NULL,'FALSE')
,(126,12,2022,4200,NULL,'FALSE')
,(126,13,2022,4200,NULL,'FALSE')
,(127,1,2022,1500,'1 year','FALSE')
,(128,1,2022,1200,'8 per @ $150','FALSE')
,(128,2,2022,1200,'8 per @ $150','FALSE')
,(128,3,2022,1200,'8 per @ $150','FALSE')
,(128,4,2022,1200,'8 per @ $150','FALSE')
,(128,5,2022,1200,'8 per @ $150','FALSE')
,(128,6,2022,1200,'8 per @ $150','FALSE')
,(128,7,2022,1200,'8 per @ $150','FALSE')
,(128,8,2022,1200,'8 per @ $150','FALSE')
,(128,9,2022,1200,'8 per @ $150','FALSE')
,(128,10,2022,1200,'8 per @ $150','FALSE')
,(128,11,2022,1200,'8 per @ $150','FALSE')
,(128,12,2022,1200,'8 per @ $150','FALSE')
,(128,13,2022,1200,'8 per @ $150','FALSE')
,(129,1,2022,3000,'20 Per @ $150','FALSE')
,(129,2,2022,3000,'20 Per @ $150','FALSE')
,(129,3,2022,3000,'20 Per @ $150','FALSE')
,(129,4,2022,3000,'20 Per @ $150','FALSE')
,(129,5,2022,3000,'20 Per @ $150','FALSE')
,(129,6,2022,3000,'20 Per @ $150','FALSE')
,(129,7,2022,3000,'20 Per @ $150','FALSE')
,(129,8,2022,3000,'20 Per @ $150','FALSE')
,(129,9,2022,3000,'20 Per @ $150','FALSE')
,(129,10,2022,3000,'20 Per @ $150','FALSE')
,(129,11,2022,3000,'20 Per @ $150','FALSE')
,(129,12,2022,3000,'20 Per @ $150','FALSE')
,(129,13,2022,3000,'20 Per @ $150','FALSE')
,(131,5,2022,4000,'Guess','FALSE')
,(133,2,2022,14500,'Est','FALSE')
,(135,1,2022,2100,'From Contract','FALSE')
,(135,2,2022,2100,'From Contract','FALSE')
,(135,3,2022,2100,'From Contract','FALSE')
,(135,4,2022,2100,'From Contract','FALSE')
,(135,5,2022,2100,'From Contract','FALSE')
,(135,6,2022,2100,'From Contract','FALSE')
,(135,7,2022,2100,'From Contract','FALSE')
,(135,8,2022,2100,'From Contract','FALSE')
,(135,9,2022,2100,'From Contract','FALSE')
,(135,10,2022,2100,'From Contract','FALSE')
,(135,12,2022,2100,'From Contract','FALSE')
,(135,13,2022,2100,'From Contract','FALSE')
,(136,1,2022,4595,'From Contract','FALSE')
,(136,2,2022,4595,'From Contract','FALSE')
,(136,3,2022,4595,'From Contract','FALSE')
,(136,4,2022,4595,'From Contract','FALSE')
,(136,5,2022,4595,'From Contract','FALSE')
,(136,6,2022,4595,'From Contract','FALSE')
,(136,7,2022,4595,'From Contract','FALSE')
,(136,8,2022,4595,'From Contract','FALSE')
,(136,9,2022,4595,'From Contract','FALSE')
,(136,10,2022,4595,'From Contract','FALSE')
,(136,12,2022,4595,'From Contract','FALSE')
,(136,13,2022,4595,'From Contract','FALSE')
,(137,5,2022,23000,'Annual','FALSE')
,(138,2,2022,25000,'Pro Services ($5k Training)','FALSE')
,(139,8,2022,275000,'Blades','FALSE')
,(140,8,2022,80000,NULL,'FALSE')
,(141,8,2022,25000,'For 2','FALSE')
,(142,8,2022,350000,'2 SANs','FALSE')
,(143,8,2022,50000,'2 Servers Mirrored','FALSE')
,(144,8,2022,50000,NULL,'FALSE')
,(145,1,2022,1500,'SWAG','FALSE')
,(145,2,2022,1500,'SWAG','FALSE')
,(145,3,2022,1500,'SWAG','FALSE')
,(145,4,2022,2000,'SWAG','FALSE')
,(145,5,2022,2000,'SWAG','FALSE')
,(145,6,2022,2000,'SWAG','FALSE')
,(145,7,2022,2500,'SWAG','FALSE')
,(145,8,2022,2500,'SWAG','FALSE')
,(145,9,2022,2500,'SWAG','FALSE')
,(145,10,2022,2500,'SWAG','FALSE')
,(145,12,2022,2500,'SWAG','FALSE')
,(145,13,2022,3000,'SWAG','FALSE')
,(146,2,2022,9500,'1 head 2 smaller','FALSE')
,(147,2,2022,3500,'SWAG (3 units)','FALSE')
,(148,1,2022,4615,'autoinject','FALSE')
,(148,2,2022,4615,'autoinject','FALSE')
,(148,3,2022,4615,'autoinject','FALSE')
,(148,4,2022,4615,'autoinject','FALSE')
,(148,5,2022,4615,'autoinject','FALSE')
,(148,6,2022,4615,'autoinject','FALSE')
,(148,7,2022,4615,'autoinject','FALSE')
,(148,8,2022,4615,'autoinject','FALSE')
,(148,9,2022,4615,'autoinject','FALSE')
,(148,10,2022,4615,'autoinject','FALSE')
,(148,11,2022,4615,'autoinject','FALSE')
,(148,12,2022,4615,'autoinject','FALSE')
,(148,13,2022,4615,'autoinject','FALSE')
,(149,5,2022,7840,'$49 hour','FALSE')
,(149,6,2022,7840,'$49 hour','FALSE')
,(149,7,2022,7840,'$49 hour','FALSE')
,(149,8,2022,7840,'$49 hour','FALSE')
,(149,9,2022,7840,'$49 hour','FALSE')
,(149,10,2022,7840,'$49 hour','FALSE')
,(149,11,2022,7840,'$49 hour','FALSE')
,(149,12,2022,7840,'$49 hour','FALSE')
,(149,13,2022,7840,'$49 hour','FALSE')
,(150,2,2022,4615,'$60k','FALSE')
,(150,3,2022,4615,'$60k','FALSE')
,(150,4,2022,4615,'$60k','FALSE')
,(150,5,2022,4615,'$60k','FALSE')
,(150,6,2022,4615,'$60k','FALSE')
,(150,7,2022,4615,'$60k','FALSE')
,(150,8,2022,4615,'$60k','FALSE')
,(150,9,2022,4615,'$60k','FALSE')
,(150,10,2022,4615,'$60k','FALSE')
,(150,11,2022,4615,'$60k','FALSE')
,(150,12,2022,4615,'$60k','FALSE')
,(150,13,2022,4615,'$60k','FALSE')
,(151,1,2022,1250,'$625 x 2 people','FALSE')
,(152,3,2022,150,'1 Mo Estimate','FALSE')
,(152,4,2022,150,'1 Mo Estimate','FALSE')
,(152,5,2022,150,'1 Mo Estimate','FALSE')
,(152,6,2022,150,'1 Mo Estimate','FALSE')
,(152,7,2022,150,'1 Mo Estimate','FALSE')
,(152,8,2022,150,'1 Mo Estimate','FALSE')
,(152,9,2022,150,'1 Mo Estimate','FALSE')
,(152,10,2022,150,'1 Mo Estimate','FALSE')
,(152,12,2022,150,'1 Mo Estimate','FALSE')
,(153,2,2022,1250,'$625 x 2 users','FALSE')
,(154,4,2022,750,NULL,'FALSE')
,(155,4,2022,4000,NULL,'FALSE')
,(156,7,2022,4000,NULL,'FALSE')
,(156,8,2022,4000,NULL,'FALSE')
,(156,9,2022,4000,NULL,'FALSE')
,(156,10,2022,4000,NULL,'FALSE')
,(156,12,2022,4000,NULL,'FALSE')
,(156,13,2022,4000,NULL,'FALSE')
,(158,11,2022,10500,'Prem Support','FALSE')
,(55,5,2022,3000,'5-day class','FALSE')
,(28,3,2023,2018,'autoinject','FALSE')
,(28,4,2023,2018,'autoinject','FALSE')
,(28,5,2023,2018,'autoinject','FALSE')
,(28,6,2023,2018,'autoinject','FALSE')
,(28,7,2023,2018,'autoinject','FALSE')
,(28,8,2023,2018,'autoinject','FALSE')
,(28,9,2023,2018,'autoinject','FALSE')
,(28,10,2023,2018,'autoinject','FALSE')
,(75,1,2023,400,'autoinject','FALSE')
,(76,12,2023,32500,NULL,'FALSE')
,(78,1,2023,1100,'autoinject','FALSE')
,(79,1,2023,1500,'autoinject','FALSE')
,(113,1,2023,30000,'guess at new agreement','FALSE')
,(127,1,2023,1500,'1 year','FALSE')
,(129,1,2023,231,'autoinject','FALSE')
,(129,2,2023,231,'autoinject','FALSE')
,(129,3,2023,231,'autoinject','FALSE')
,(129,4,2023,231,'autoinject','FALSE')
,(129,5,2023,231,'autoinject','FALSE')
,(129,6,2023,231,'autoinject','FALSE')
,(129,7,2023,231,'autoinject','FALSE')
,(129,8,2023,231,'autoinject','FALSE')
,(129,9,2023,231,'autoinject','FALSE')
,(129,10,2023,231,'autoinject','FALSE')
,(129,11,2023,231,'autoinject','FALSE')
,(129,12,2023,231,'autoinject','FALSE')
,(129,13,2023,231,'autoinject','FALSE')
,(133,2,2023,14500,'Est','FALSE')
,(149,1,2023,7840,'$49 hour','FALSE')
,(149,2,2023,7840,'$49 hour','FALSE')
,(149,3,2023,7840,'$49 hour','FALSE')
,(149,4,2023,7840,'$49 hour','FALSE')
,(75,1,2024,400,'autoinject','FALSE')
,(113,1,2024,30000,NULL,'FALSE')
,(149,5,2024,175000,'CheckPoint 3-year','FALSE')
,(127,1,2024,1500,'1 year','FALSE')
,(132,6,2024,18000,'3-yr agreement','FALSE')
,(134,3,2024,6720,'3-year','FALSE')
,(159,11,2024,500,NULL,'FALSE')
,(113,1,2025,30000,NULL,'FALSE')
,(9,6,2021,750,'Mileage','FALSE')
,(7,6,2021,1250,'3 x 3 night hotel rooms Fargo','FALSE')
,(6,5,2021,600,'3 nights hotel and food','FALSE')
,(10,6,2021,350,'1 x 3 hotel nights Fargo','FALSE')
,(24,7,2021,1500,'1x1 class (5 day)','FALSE')
,(12,9,2021,750,'Jims Trip to Orlando!','FALSE')
,(26,6,2021,64250,'autoinject','FALSE')
,(25,11,2021,45500,'Annual Maintenance','FALSE')
,(8,6,2021,750,'3 cars mileage to Fargo','FALSE')
,(24,3,2021,1250,'1 x1 class (3 day)','FALSE')
,(6,12,2021,600,'3 nights hotel and food','FALSE')
,(26,6,2021,63520,'autoinject','FALSE')
,(23,2,2021,1250,'1 person class','FALSE')
,(11,6,2021,500,'Meals for Jim','FALSE')
,(29,9,2021,2055,'autoinject','FALSE')
,(27,5,2021,38000,'autoinject','FALSE')
,(29,9,2022,2600,'+1 license','FALSE')
,(27,5,2022,38500,'autoinject','FALSE')
,(33,2,2020,27000,'autoinject','FALSE')
,(32,11,2022,900,'Maintenance','FALSE')
,(30,2,2020,29500,'autoinject','FALSE')
,(33,2,2021,27500,'autoinject','FALSE')
,(33,2,2023,28000,'autoinject','FALSE')
,(28,5,2021,12200,'autoinject','FALSE')
,(162,3,2019,6850,'1 year','FALSE')
,(162,3,2020,7200,'1 year','FALSE')
,(55,3,2022,7200,' ','FALSE')
,(160,9,2021,1250,'Install Kit','FALSE')
,(160,9,2021,450,'Cables','FALSE')
,(55,1,2022,450,'autoinject','FALSE')
,(55,5,2022,450,'autoinject','FALSE')
,(55,9,2022,450,'autoinject','FALSE')
,(55,13,2022,450,'autoinject','FALSE')
,(33,2,2022,27500,'autoinject','FALSE')
,(16,1,2021,700,'Hotel Stay','FALSE')
,(15,2,2021,600,'Food','FALSE')
,(15,2,2020,550,'Food','FALSE')
,(15,8,2021,600,'Food','FALSE')
,(15,8,2020,550,'Food','FALSE')
,(2,NULL,NULL,0,'<-','FALSE')
,(4,2,2021,1400,'this is a test','FALSE')
,(4,3,2021,2400,NULL,'FALSE')
,(4,4,2021,600,'Additional trip','FALSE')
,(167,3,2022,580,'adjusted Price','FALSE')
,(167,3,2021,560,'adjusted Price','FALSE')
,(85,6,2021,1500,'added for testing','FALSE')
,(85,5,2020,19000,'autoinject','FALSE')
,(85,3,2022,6500,'Moved to P3 based on Invoicing','FALSE')
,(85,5,2021,6500,'Adjusted due to change in qty','FALSE')
,(1,7,2020,1750,'Not so fancy resturants','TRUE')
,(5,2,2021,325,'Tentative Cost - Review','FALSE')
,(5,6,2021,325,'Tentative Cost - Review','FALSE')
,(45,10,2022,200,NULL,'FALSE')
,(44,4,2021,200,NULL,'FALSE')
,(44,4,2021,200,NULL,'FALSE')
,(44,4,2021,200,NULL,'FALSE')
,(44,4,2021,200,NULL,'FALSE')
,(160,9,2021,75000,'Primary Box','FALSE')
,(160,11,2021,75000,'Secondary Box','FALSE')
,(162,3,2018,6250,'1 year','FALSE')
,(55,3,2021,8500,'? still required??','FALSE');
