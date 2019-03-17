import {Injectable} from '@angular/core';
import * as PouchDB from 'pouchdb';
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';

@Injectable()
    export class BirthdayServiceProvider{
        private _db;
        private _birthdays;
        window: any ["PouchDB"]=PouchDB;

        initDB(){
            PouchDB.plugin(cordovaSqlitePlugin);
            this._db=new PouchDB('birthdays.db', {adapter: 'cordova-sqlite'});
        }

        add(birthday){
            return this._db.post(birthday);
        }

        update(birthday) {  
            return this._db.put(birthday);
        }
        
        delete(birthday) {  
            return this._db.remove(birthday);
        }

        getAll(){
            if(!this._birthdays){
                return this._db.allDocs({include_docs: true})
                .then(docs => {
                    this._birthdays=docs.rows.map(row => {
                        row.doc.Date=new Date(row.doc.Date);
                        return row.doc;
                    });

                    this._db.changes({ live: true,  since: 'now', include_docs: true}).on('change', this.onDatabaseChange);

                    return this._birthdays;
                });
            }
            else{
                return Promise.resolve(this._birthdays);
            }
        }

        onDatabaseChange= (change) =>{
            var index=this.findIndex(this._birthdays, change.id);
            var birthday=this._birthdays[index];

            if(change.deleted){
                if(birthday){
                    this._birthdays.splice(index,1);        //deletion
                }
                else{
                    change.doc.Date=new Date(change.doc.Date);
                    if(birthday && birthday._id === change.id){
                        this._birthdays[index]=change.doc;      //updation
                    }
                    else{
                        this._birthdays.splice(index,0,change.doc)      //insertion
                    }
                }
            }
        }
        private findIndex(array, id){
            var low=0, high=array.length, mid;
            while(low<high){
                mid=(low+high) >>> 1;
                array[mid]._id<id ? low=mid+1 : high=mid;
            }
            return low;
        }
}