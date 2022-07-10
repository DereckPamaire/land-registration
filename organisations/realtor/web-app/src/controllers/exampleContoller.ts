
import { Request, Response } from 'express';



const eg =(req: Request, res: Response) => {
	// variable with some data to send to views and partials
	const mascots = [
		{ name: 'Sammy', organization: 'DigitalOcean', birth_year: 2012 },
		{ name: 'Tux', organization: 'Linux', birth_year: 1996 },
		{ name: 'Moby Dock', organization: 'Docker', birth_year: 2013 },
	];
	const tagLine = 'No programming concept is complete without a cute animal mascot.';
	res.render('pages/eg', {
		mascots,
		tagLine,
	});
};


export {
	eg,
};