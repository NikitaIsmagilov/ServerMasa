import { Connection, SqlClient, Error } from 'msnodesqlv8'
import { ErrorCodes } from '../constants';
import { systemError, whiteBoardType } from '../entities';

interface ISchoolService {
    getBoardTypes(): Promise<whiteBoardType[]>;
}

interface localWhiteBoardType {
    id: number;
    white_board_type: string;
}

export class SchoolService implements ISchoolService {
    
    public getBoardTypes(): Promise<whiteBoardType[]> {
        return new Promise<whiteBoardType[]>((resolve, reject) => {
            const sql: SqlClient = require("msnodesqlv8");
            const connectionString: string = "server=.;Database=masa_school;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
            const query: string = "SELECT * FROM white_board_type";
            const result: whiteBoardType[] = [];
    
            sql.open(connectionString,  (connectionError: Error, connection: Connection) => {
                if (connectionError !== null) {
                    const error: systemError = {
                        code: ErrorCodes.ConnectionError,
                        message: "SQL server connection error"
                    }
                    reject(error);
                } 
                else {
                    connection.query(query, (queryError: Error | undefined, queryResult: localWhiteBoardType[] | undefined) => {
                        if (queryResult !== undefined) {
                            queryResult.forEach(
                                (whiteBoardType: localWhiteBoardType) => {
                                    result.push(this.parseLocalBoardType(whiteBoardType))
                                });
                        }
                        
                        //console.log(result);
                        resolve(result);
                    })
                }
            });
        });
    }

    private parseLocalBoardType(local: localWhiteBoardType): whiteBoardType {     
        return {
            id: local.id,
            type: local.white_board_type
        }
    }
}
