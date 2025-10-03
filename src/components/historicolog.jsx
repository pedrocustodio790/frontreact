import {
  Paper,
  Typography,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent, // Ótimo para colocar a data no lado oposto
} from '@mui/lab';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

function HistoricoLog({ historicoProcessado }) {
  const formatarData = (dataString) => {
    // ... sua função de formatar data continua perfeita
  };

  if (historicoProcessado.length === 0) {
    return <Typography sx={{ p: 2, textAlign: 'center' }}>Nenhuma movimentação encontrada.</Typography>;
  }

  return (
    // A <ul> vira o componente <Timeline>
    <Timeline position="alternate"> {/* 'alternate' coloca os itens um de cada lado */}
      {historicoProcessado.map((item) => (
        // A <li> vira o <TimelineItem>
        <TimelineItem key={item.id}>
          
          {/* Componente para alinhar a data/hora no lado oposto */}
          <TimelineOppositeContent color="text.secondary" sx={{ pt: '12px' }}>
            {formatarData(item.dataHora)}
          </TimelineOppositeContent>

          {/* O separador com o ponto e a linha */}
          <TimelineSeparator>
            <TimelineDot color={item.tipo === 'ENTRADA' ? 'success' : 'error'} variant="outlined">
              {item.tipo === 'ENTRADA' ? <ArrowUpCircle size={20}/> : <ArrowDownCircle size={20}/>}
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>

          {/* O conteúdo principal do item */}
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" component="h3">
                {item.nomeComponente || `ID: ${item.componenteId}`}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {item.tipo === 'ENTRADA' ? 'Entrada de' : 'Saída de'} <strong>{item.quantidade}</strong> unidade(s).
              </Typography>
              <Typography variant="caption" color="text.secondary">
                por {item.usuario || 'Sistema'}
              </Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

export default HistoricoLog;