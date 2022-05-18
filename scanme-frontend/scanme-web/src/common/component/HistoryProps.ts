import * as H from 'history';
import {match} from 'react-router-dom';

export interface HistoryProps {
  location: H.Location;
  history: H.History;
  match?: match;
}
