import { FC } from "react";
// Components
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import RelationRow from "./RelationRow";
// Types
import { Mutate } from "@/hooks/useFetch";
import { GetRelationsResponse } from "@/types/api";
import { EvaluationRelation } from "@/types/relations";
import { Team } from "@/types/teams";

type Props = {
  relations: EvaluationRelation[];
  mutate: Mutate<GetRelationsResponse>;
  teams: Team[];
  showAdviserColumn?: boolean;
};

const columnHeadings: { heading: string; align: "left" | "right" }[] = [
  { heading: "Relation ID", align: "left" },
  { heading: "Evaluator", align: "left" },
  { heading: "Evaluatee", align: "left" },
  { heading: "Adviser", align: "left" },
  { heading: "Actions", align: "right" },
];

const RelationTable: FC<Props> = ({
  relations,
  mutate,
  teams,
  showAdviserColumn,
}) => {
  const filteredColumnHeadings = columnHeadings.filter(({ heading }) => {
    switch (heading) {
      case "Adviser":
        return Boolean(showAdviserColumn);

      default:
        return true;
    }
  });

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {filteredColumnHeadings.map(({ heading, align }) => (
                <TableCell key={heading} align={align}>
                  {heading}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {relations.map((relation) => (
              <RelationRow
                key={relation.id}
                relation={relation}
                mutate={mutate}
                teams={teams}
                showAdviserColumn={Boolean(showAdviserColumn)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default RelationTable;
