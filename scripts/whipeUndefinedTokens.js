import pdb from '../src/util/pdb';

setInterval(() => {
    pdb.connect(process.env.TECH_DOMAIN_MONGOLAB_URI, 'enlistments')
        .then(([ db, col]) => {
            return col.remove({ userToken: 'undefined' });
        })
        .then(() => console.log('Removed undefined!'))
        .catch((err) => {
            console.log(err.stack);
        });
}, 3000);