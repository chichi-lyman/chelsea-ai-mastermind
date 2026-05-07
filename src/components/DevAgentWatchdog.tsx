import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { triggerSelfHealing } from '@/services/MastermindEngine';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isHealing: boolean;
}

export class DevAgentWatchdog extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    isHealing: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      isHealing: false,
    };
  }

  public async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log('DevAgent: Crash Detected. Initializing Repair Loop...', error);
    this.setState({
      errorInfo,
      isHealing: true,
    });

    // Trigger self-healing
    const success = await triggerSelfHealing(error.message, errorInfo.componentStack);

    if (success) {
      // Auto-reset on successful healing
      setTimeout(() => {
        this.setState({
          hasError: false,
          error: null,
          errorInfo: null,
          isHealing: false,
        });
      }, 2000);
    } else {
      this.setState({ isHealing: false });
    }
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isHealing: false,
    });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>🤖 DEV AGENT ACTIVATED</Text>
            <Text style={styles.status}>
              {this.state.isHealing ? '⚡ REPAIRING CODE...' : '❌ ERROR DETECTED'}
            </Text>

            {this.state.error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText} numberOfLines={3}>
                  {this.state.error.toString()}
                </Text>
              </View>
            )}

            {!this.state.isHealing && (
              <TouchableOpacity style={styles.retryButton} onPress={this.handleRetry}>
                <Text style={styles.retryText}>🔄 MANUAL RETRY</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.footer}>
              {this.state.isHealing
                ? 'Self-healing in progress. Please wait...'
                : 'Waiting for manual intervention or automatic patch'}
            </Text>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff4d4d',
    letterSpacing: 2,
  },
  status: {
    fontSize: 18,
    color: '#ffd700',
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: 'rgba(255, 77, 77, 0.1)',
    borderColor: '#ff4d4d',
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    maxWidth: '100%',
  },
  errorText: {
    color: '#ff9999',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  retryButton: {
    backgroundColor: '#ff4d4d',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    color: '#999',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  },
});