/** @jsxImportSource @emotion/react */
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { css } from "@emotion/react";
import { bp } from "./utils/mediaQueries";

const API_URL = "https://api.openai.com/v1/";
const API_KEY = "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";

type Format = "url" | "b64_json";
type GenerateSize = "256x256" | "512x512" | "1024x1024";
type ImageSize = 256 | 512 | 1024;

export const App = () => {
  const [imageData, setImageData] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [format, setFormat] = useState<Format>("url");
  const [generateSize, setGenerateSize] = useState<GenerateSize>("256x256");
  const [imageSize, setImageSize] = useState<ImageSize>(512);

  const generateImage = useCallback(async () => {
    if (!prompt) {
      alert("プロンプトがありません。");
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}images/generations`,
        {
          prompt,
          n: 1,
          size: generateSize,
          response_format: format,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      setImageData(response.data.data[0][format]);
    } catch (error: any) {
      setError(error.toString());
    } finally {
      setIsLoading(false);
    }
  }, [format, generateSize, isLoading, prompt]);

  useEffect(() => {
    setImageSize(
      generateSize === "256x256" ? 256 : generateSize === "512x512" ? 512 : 1024
    );
  }, [generateSize, imageSize]);

  return (
    <Container css={containerStyles}>
      <Box css={contentsWrapperStyles} width="100%">
        <Stack
          spacing={{ xs: 1, sm: 2 }}
          direction={{ xs: "column", sm: "row" }}
        >
          <TextField
            label="プロンプト"
            value={prompt}
            fullWidth
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
          />
          <Stack spacing={{ xs: 1, sm: 2 }} direction="row">
            <Select
              value={generateSize}
              onChange={(e) => setGenerateSize(e.target.value as GenerateSize)}
            >
              <MenuItem value="256x256">256 x 256</MenuItem>
              <MenuItem value="512x512">512 x 512</MenuItem>
              <MenuItem value="1024x1024">1024 x 1024</MenuItem>
            </Select>

            <Select
              onChange={(e) => setFormat(e.target.value as Format)}
              value={format}
            >
              <MenuItem value="url">URL</MenuItem>
              <MenuItem value="b64_json">Base64</MenuItem>
            </Select>

            <Button
              css={buttonStyles}
              onClick={generateImage}
              disabled={isLoading}
              variant="contained"
            >
              {isLoading ? "作成中..." : "画像作成"}
            </Button>
          </Stack>
        </Stack>

        {error && <pre>{error}</pre>}

        <Box mt={2}>
          {imageData && (
            <figure css={figureStyles}>
              <img
                src={
                  format === "b64_json"
                    ? `data:image/png;base64,${imageData}`
                    : imageData
                }
                alt="Received Data"
                width={imageSize}
                height={imageSize}
              />
            </figure>
          )}
        </Box>
      </Box>
    </Container>
  );
};

const containerStyles = css`
  padding: 16px;
  display: flex;
  min-height: 100vh;
  ${bp.sm} {
    padding: 24px;
  }
  ${bp.md} {
    padding: 32px;
  }
`;

const contentsWrapperStyles = css`
  background-color: #ffffff;
  border-radius: 6px;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.08);
  padding: 16px;
  flex: 1;
  ${bp.sm} {
    padding: 24px;
  }
  ${bp.md} {
    padding: 32px;
  }
`;

const buttonStyles = css`
  white-space: nowrap;
  flex: 1;
`;

const figureStyles = css`
  margin: 0;
`;
