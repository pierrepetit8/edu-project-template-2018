import TableHead from "material-ui/Table/TableHead";
import {Checkbox, TableCell, TableRow} from "material-ui";
import React from "react";


const TableList = (props) => {
    return (
        <Grid container justify="center">
            <Grid item xs={6}>
                <Paper style={{width: 'auto', textAlign: 'center'}}>
                    <Table>
                        <TableHeader handleSelectAllClick={this.handleSelectAllClick.bind(this)}
                                     length={props.length}
                                     rowCount={this.state.rowCount}/>
                        <TableBody>
                            {this.state.episodes.map(episode => {
                                return ( <Episode key={episode.id} episode={episode} handleClick={this.handleClick.bind(this)} isSelected={this.isSelected.bind(this)}/>);
                            })}
                            <TableChangeRow name={this.state.name}
                                            note={this.state.note}
                                            code={this.state.code}
                                            handleChange={this.handleChange.bind(this)}/>
                        </TableBody>
                    </Table>
                </Paper>

            </Grid>
        </Grid>
    );
};


export default TableList;