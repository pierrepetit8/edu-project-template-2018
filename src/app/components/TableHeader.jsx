import TableHead from "material-ui/Table/TableHead";
import {Checkbox, TableCell, TableRow} from "material-ui";
import React from "react";


const TableHeader = (props) => {
    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox"><Checkbox
                    onChange={(event, checked) => props.handleSelectAllClick(event, checked)}
                    checked={props.rowCount === props.length}/></TableCell>
                <TableCell padding="none" style={{textAlign: 'flex-start'}}><h3>Name</h3>
                </TableCell>
                <TableCell style={{textAlign: 'center'}}><h3>Code</h3></TableCell>
                <TableCell style={{textAlign: 'flex-end'}} numeric><h3>Note</h3>
                </TableCell>
            </TableRow>
        </TableHead>
    );
};


export default TableHeader;