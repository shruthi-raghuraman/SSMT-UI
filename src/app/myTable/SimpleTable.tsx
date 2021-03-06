import React from "react";

import {
  Table,
  TableHeader,
  TableBody,
  textCenter,
} from '@patternfly/react-table';

type SimpleTableProps = {};

type SimpleTableState = {
  columns: Array<object | string>;
  rows: Array<object>;
}

const textFormatting = {
  transforms: [textCenter],
  cellTransforms: [textCenter]
} as React.CSSProperties

class SimpleTable extends React.Component<SimpleTableProps, SimpleTableState> {
  constructor(props: SimpleTableProps) {
    super(props);
    this.state = {
      columns: [
        { title: <div style={textFormatting}>Sr No</div> },
        { title: <div style={textFormatting}> Project Name</div> },
        { title: <div style={textFormatting}> No. of Nodes </div> },
      ],
      rows: [
        { cells: ['1', 'AI COE', '37'] },
        { cells: ['2', 'Teckton', '19'] },
        { cells: ['3', 'Chris', '64'] },
      ]
    };
  }

  render() {
    return (
      <Table aria-label="Simple Table" cells={this.state.columns} rows={this.state.rows}>
        <TableHeader />
        <TableBody />
      </Table>
    );
  }
}
export { SimpleTable };