import { FC, useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Alert,
  InputAdornment,
} from "@mui/material";
import {
  Save,
  Refresh,
  Domain,
  SettingsEthernet,
  CheckCircle,
} from "@mui/icons-material";

interface DomainConfig {
  domain: string;
  port: string;
}

const DomainSettings: FC = () => {
  const [config, setConfig] = useState<DomainConfig>({
    domain: "",
    port: "",
  });
  const [originalConfig, setOriginalConfig] = useState<DomainConfig>({
    domain: "",
    port: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load saved configuration from localStorage
    const savedDomain = localStorage.getItem("customDomain");
    const savedPort = localStorage.getItem("customPort");
    
    const domain = savedDomain || "";
    const port = savedPort || "";
    
    setConfig({ domain, port });
    setOriginalConfig({ domain, port });
  }, []);

  useEffect(() => {
    // Check if there are unsaved changes
    const changed =
      config.domain !== originalConfig.domain ||
      config.port !== originalConfig.port;
    setHasChanges(changed);
  }, [config, originalConfig]);

  const validateDomain = (domain: string): boolean => {
    if (!domain) return false;
    // Basic domain validation
    const domainRegex =
      /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$|^localhost$|^(\d{1,3}\.){3}\d{1,3}$/;
    return domainRegex.test(domain);
  };

  const validatePort = (port: string): boolean => {
    if (!port) return false;
    const portNum = parseInt(port, 10);
    return portNum > 0 && portNum <= 65535;
  };

  const handleDomainChange = (value: string) => {
    setError("");
    setSuccess("");
    setConfig((prev) => ({ ...prev, domain: value }));
  };

  const handlePortChange = (value: string) => {
    setError("");
    setSuccess("");
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setConfig((prev) => ({ ...prev, port: value }));
    }
  };

  const handleSave = () => {
    setError("");
    setSuccess("");

    // Validate domain
    if (config.domain && !validateDomain(config.domain)) {
      setError("Please enter a valid domain or IP address");
      return;
    }

    // Validate port
    if (config.port && !validatePort(config.port)) {
      setError("Please enter a valid port number (1-65535)");
      return;
    }

    // Save to localStorage
    if (config.domain) {
      localStorage.setItem("customDomain", config.domain);
    } else {
      localStorage.removeItem("customDomain");
    }

    if (config.port) {
      localStorage.setItem("customPort", config.port);
    } else {
      localStorage.removeItem("customPort");
    }

    setOriginalConfig({ ...config });
    setSuccess("Domain and port settings saved successfully!");
    
    // Reload the page to apply changes
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleReset = () => {
    setError("");
    setSuccess("");
    setConfig({ ...originalConfig });
  };

  const getBaseUrl = (): string => {
    const domain = config.domain || localStorage.getItem("customDomain") || "";
    const port = config.port || localStorage.getItem("customPort") || "";
    
    if (!domain) {
      //@ts-ignore
      return import.meta.env.VITE_BASE_URL || "";
    }
    
    const protocol = domain.includes("localhost") || /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(domain)
      ? "http"
      : "https";
    
    return port ? `${protocol}://${domain}:${port}` : `${protocol}://${domain}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 500, color: "#202124", mb: 1 }}>
        Domain & Port Configuration
      </Typography>
      <Typography variant="body2" sx={{ color: "#5f6368", mb: 3 }}>
        Configure a custom domain and port for the API endpoint. Leave empty to use default settings.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccess("")}
          icon={<CheckCircle />}
        >
          {success}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: "1px solid #e0e0e0",
          borderRadius: 2,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Domain"
            placeholder="example.com or 192.168.1.13"
            value={config.domain}
            onChange={(e) => handleDomainChange(e.target.value)}
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Domain sx={{ color: "#5f6368" }} />
                </InputAdornment>
              ),
            }}
            helperText="Enter domain name or IP address (e.g., example.com, 192.168.1.13, localhost)"
            sx={{ mb: 2 }}
          />

          <TextField
            label="Port"
            placeholder="3011"
            value={config.port}
            onChange={(e) => handlePortChange(e.target.value)}
            fullWidth
            variant="outlined"
            type="text"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SettingsEthernet sx={{ color: "#5f6368" }} />
                </InputAdornment>
              ),
            }}
            helperText="Enter port number (1-65535)"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="subtitle2" sx={{ color: "#5f6368", mb: 1 }}>
            Current API Base URL:
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: "#f8f9fa",
              border: "1px solid #e0e0e0",
              borderRadius: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontFamily: "monospace",
                color: "#202124",
                wordBreak: "break-all",
              }}
            >
              {getBaseUrl() || "Using default from environment"}
            </Typography>
          </Paper>
        </Box>
      </Paper>

      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          onClick={handleReset}
          disabled={!hasChanges}
          startIcon={<Refresh />}
          sx={{
            textTransform: "none",
            borderColor: "#dadce0",
            color: "#202124",
            "&:hover": {
              borderColor: "#1976d2",
              bgcolor: "#f8f9fa",
            },
            "&:disabled": {
              borderColor: "#e0e0e0",
              color: "#9e9e9e",
            },
          }}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!hasChanges}
          startIcon={<Save />}
          sx={{
            textTransform: "none",
            bgcolor: "#1976d2",
            "&:hover": {
              bgcolor: "#1565c0",
            },
            "&:disabled": {
              bgcolor: "#e0e0e0",
              color: "#9e9e9e",
            },
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default DomainSettings;
