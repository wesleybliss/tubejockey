start:
	cd api; node app.js

watch:
	supervisor ./api/app.js
