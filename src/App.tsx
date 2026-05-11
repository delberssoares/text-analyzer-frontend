import { useState } from "react";
import { Grid, Typography, Button } from "@mui/material";
import styled from "styled-components";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";

const API_URL = import.meta.env.VITE_API_URL;

const Page = styled(Grid)`
  min-height: 100vh;
  padding: 24px;
  background: #f4f6fb;
  box-sizing: border-box;
`;

const MainGrid = styled(Grid)`
  width: 100%;
  max-width: 1100px;
  margin-top: 8px;
`;

const TextCard = styled(Grid)`
  background: #fff;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 6px 18px rgba(17, 24, 39, 0.06);
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
  min-height: 420px;

  @media (max-width: 900px) {
    width: 100%;
    min-height: 360px;
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  flex: 1;
  min-height: 260px;
  max-height: 100%;
  box-sizing: border-box;
  padding: 14px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #d6d6d6;
  resize: none;
  background: #fcfcff;
  outline: none;
  overflow-y: auto;
`;

const PanelCard = styled(Grid)`
  background: #fff;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 6px 18px rgba(17, 24, 39, 0.06);
  min-width: 240px;
  max-width: 320px;
  box-sizing: border-box;

  @media (max-width: 900px) {
    width: 100%;
    max-width: none;
  }
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  font-size: 0.95rem;
`;

const Actions = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  flexWrap: "wrap",
  width: "100%",
  marginTop: "8px",
});



export default function App() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!text.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error("Erro ao analisar o texto.");
      }

      const data = await res.json();
      setStats(data);
    } catch (err) {
      alert("Erro ao conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setText("");
    setStats(null);
  }

  return (
    <Page container direction="column" alignItems="center">
      <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center" }}>
        Analisador de Texto
      </Typography>

      <MainGrid
        container
        spacing={3}
        justifyContent="center"
        alignItems="stretch"
        sx={{ marginTop: 2 }}
      >
        <Grid size={{ xs: 12, md: 7 }}>
          <TextCard>
            <Typography sx={{ fontWeight: 600 }}>Digite seu texto:</Typography>

            <StyledTextarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Cole ou digite aqui. O backend irá analisar."
            />

            <Actions>
              <Button
                variant="outlined"
                startIcon={<ContentPasteIcon />}
                onClick={async () => {
                  try {
                    const clipboardText = await navigator.clipboard.readText();
                    setText(clipboardText);
                  } catch (err) {
                    alert("Não foi possível acessar a área de transferência.");
                  }
                }}
              >
                Colar
              </Button>

              <Button variant="outlined" onClick={handleClear}>
                Limpar
              </Button>

              <Button
                variant="contained"
                disabled={loading}
                onClick={handleAnalyze}
              >
                {loading ? "Analisando..." : "Analisar"}
              </Button>
            </Actions>
          </TextCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <PanelCard>
            <Typography sx={{ fontWeight: 700, marginBottom: 1.5 }}>
              Dados do Texto
            </Typography>

            <StatRow>
              <span>Letras:</span>
              <strong>{stats?.letters ?? "-"}</strong>
            </StatRow>

            <StatRow>
              <span>Letras (sem espaços):</span>
              <strong>{stats?.letters_no_space ?? "-"}</strong>
            </StatRow>

            <StatRow>
              <span>Palavras:</span>
              <strong>{stats?.words ?? "-"}</strong>
            </StatRow>

            <StatRow>
              <span>Frases (≈):</span>
              <strong>{stats?.sentences ?? "-"}</strong>
            </StatRow>

            <StatRow>
              <span>Linhas:</span>
              <strong>{stats?.lines ?? "-"}</strong>
            </StatRow>

            <StatRow>
              <span>Média palavras/frase:</span>
              <strong>{stats?.avg_words_per_sentence ?? "-"}</strong>
            </StatRow>

            <StatRow style={{ borderBottom: "none" }}>
              <span>Densidade (chars/word):</span>
              <strong>{stats?.density ?? "-"}</strong>
            </StatRow>
          </PanelCard>
        </Grid>
      </MainGrid>
    </Page>
  );
}
