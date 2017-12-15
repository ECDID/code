DROP MATERIALIZED VIEW IF EXISTS CLIENT_VIEW;
DROP MATERIALIZED VIEW IF EXISTS PROJECT_VIEW;

/* client_view will be used to show all the information about clients in order to contact them */
CREATE MATERIALIZED VIEW client_view as 
	SELECT cl.client_name, cl.client_phone, cl.client_email, p.project_name, p.id, l.username
		FROM client cl

		JOIN client_login cll,
		ON cll.client_id = cl.id
		
		JOIN login l,
		on cll.login_id = l.id
		
		JOIN client_project clp
		ON cl.id = clp.client_id

		JOIN project p
		ON clp.project_id = p.id;
		

/* It is necessary to create an index on the view in order to update the view */
CREATE UNIQUE INDEX ON client_view (id);


/* Create a function in order to update the view that will be called on database change */
CREATE OR REPLACE FUNCTION update_client_view()
	RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
	REFRESH MATERIALIZED VIEW CONCURRENTLY client_view;
RETURN NULL;
END;
$$;

/* A trigger for the table client that calls the previous function defined above */
CREATE TRIGGER client_view_trigger AFTER INSERT OR UPDATE OR DELETE
	ON client
FOR EACH STATEMENT EXECUTE PROCEDURE update_client_view();

/* A trigger for the table client_project that calls the previous function defined above */
CREATE TRIGGER client_view_trigger AFTER INSERT OR UPDATE OR DELETE
	ON client_project
FOR EACH STATEMENT EXECUTE PROCEDURE update_client_view();

/* A trigger for the table project that calls the previous function defined above */
CREATE TRIGGER client_view_trigger AFTER INSERT OR UPDATE OR DELETE
	ON project
FOR EACH STATEMENT EXECUTE PROCEDURE update_client_view();

/* A trigger  for the table login that calls the previous function defined above*/
CREATE TRIGGER client_view_trigger AFTER INSERT OR UPDATE OR DELETE
	ON login
FOR EACH STATEMENT EXECUTE PROCEDURE update_client_view();

/* A trigger  for the table client_login that calls the previous function defined above*/
CREATE TRIGGER client_view_trigger AFTER INSERT OR UPDATE OR DELETE
	ON client_login
FOR EACH STATEMENT EXECUTE PROCEDURE update_client_view();


/* project_view will be used to show all the information about projects in order to display them on the website */

CREATE MATERIALIZED VIEW project_view as 
	SELECT b.RFID, lb.batch_id, l.location_name, p.project_name, plnt.plant_name, clp.client_id
		FROM project p

		JOIN client_project clp
		ON clp.project_id = p.id
		
		JOIN project_location pl
		ON pl.project_id = p.id

		JOIN location l
		ON l.id = pl.location_id

		JOIN location_batch lb
		ON lb.location_id = l.id

		JOIN batch b
		ON b.id = lb.batch_id;
		
		JOIN plant plnt
		ON plnt.id = b.plant_id;

CREATE UNIQUE INDEX ON client_view (RFID);

CREATE OR REPLACE FUNCTION update_project_view()
	RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
	REFRESH MATERIALIZED VIEW CONCURRENTLY project_view;
RETURN NULL;
END;
$$;

/* client_project */
CREATE TRIGGER project_view_trigger AFTER INSERT OR UPDATE OR DELETE
	ON client_project
FOR EACH STATEMENT EXECUTE PROCEDURE update_project_view();

/* project */
CREATE TRIGGER project_view_trigger AFTER INSERT OR UPDATE OR DELETE
	ON project
FOR EACH STATEMENT EXECUTE PROCEDURE update_project_view();

/* project_location */
CREATE TRIGGER project_view_trigger AFTER INSERT OR UPDATE OR DELETE
	ON project_location
FOR EACH STATEMENT EXECUTE PROCEDURE update_project_view();

/* location */
CREATE TRIGGER project_view_trigger AFTER INSERT OR UPDATE OR DELETE
	ON location
FOR EACH STATEMENT EXECUTE PROCEDURE update_project_view();

/* location_batch */
CREATE TRIGGER project_view_trigger AFTER INSERT OR UPDATE OR DELETE
	ON location_batch
FOR EACH STATEMENT EXECUTE PROCEDURE update_project_view();

/* batch */
CREATE TRIGGER project_view_trigger AFTER INSERT OR UPDATE OR DELETE
	ON batch
FOR EACH STATEMENT EXECUTE PROCEDURE update_project_view();

/* plant */
CREATE TRIGGER project_view_trigger AFTER INSERT OR UPDATE OR DELETE
	ON plant
FOR EACH STATEMENT EXECUTE PROCEDURE update_project_view();




