import {TableCell, TableRow, TextField} from "material-ui";
import React from "react";


const TableChangeRow = (props) => {
    return (
        <TableRow>
            <TableCell padding="checkbox"/>
            <TableCell padding="none" style={{textAlign: 'flex-start'}}>
                <TextField
                    id="name"
                    label="name"
                    value={props.name}
                    onChange={props.handleChange('name')}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                />
            </TableCell>
            <TableCell style={{textAlign: 'center'}}>
                <TextField
                    id="code"
                    label="code"
                    value={props.code}
                    onChange={props.handleChange('code')}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"/>
            </TableCell>
            <TableCell style={{textAlign: 'flex-end'}} numeric>
                <TextField
                    id="number"
                    label="Number"
                    value={props.note}
                    onChange={props.handleChange('note')}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"/>
            </TableCell>
        </TableRow>
    );
};


export default TableChangeRow;